import io from 'socket.io-client';
import MobileDetect from 'mobile-detect';

export default class {
	constructor(name) {
		this.name = name; //매니저를 구분 짓는 이름
    this.socket = null; //io 전송 방식에 따른 객체 저장

    this.sndBuf = null; //전송용 ABuffer 객체
    this.rcvBuf = null; //수신용 ABuffer 객체
    this.queryListeners = []; //IO 이벤트를 수신할 객체들을 모아둔 배열
    this.realComps = {}; //리얼 데이터를 수신할 컴포넌트 모음
    this.realCallbacks = {};      //.Feed 리얼데이터 콜백함수
    this.realPushCallbacks = {};  //.Push 리얼데이터 콜백함수
    this.lastQueryTime = null;  //최근 조회시간

    //초기화	
    this.headerInfo = null;
    this.setHeaderInfo();

    this.errorData = {
      trName: '',
      errCode: '', //메시지코드/오류코드
      errMsg: '' //에러 메시지
    };

    //수신 패킷 정보
    this.packetInfo = {
      packetType: 0,
      packetId: 0,
      menuNo: '',
      groupName: '',
      trName: ''
    };

    //전송 패킷 정보
    this.sendInfo = {
      packetType: 0,
      packetId: 0,
      menuNo: '',
      groupName: '',
      trName: ''
    };

    this.publicKey = null;
    this.sessionKey = null;

    this.packetId = 0;

    this.isShowProgress = true;
    this.timeoutSec = 15; //zero is unlimit

    this.errCodeMap = {};
    this.queryCallbacks = {};
    this.realProcMap = {};

    this.serverStarted = false;
  }

  setConnectCallback(callback) {
    this.connectCallback = callback;
  }

  setClosedCallback(callback) {
    this.closedCallback = callback;
  }

  onSocketConnected(userInfo) {
    console.log('onSocketConnected');
    this.serverStarted = true;
    this.connectCallback(userInfo);
  }

  onSocketClosed() {
    console.log('onSocketClosed');
    this.socket.disconnect();
    this.socket = null;
    this.serverStarted = false;
    this.closedCallback();
  };

  onSocketError(e) {
    console.log('onSocketError');  
  }

  startManager(connectionUrl) {
    let md = new MobileDetect(window.navigator.userAgent);
    const socket = io(connectionUrl, {
      query: { token: '~!@#$%^&*()_+', mediaType: md.mobile()?'21':'20' }
    });

    socket.on('connection', (userInfo) => {
      console.log('connection', userInfo);
      this.onSocketConnected(userInfo);
    });

    socket.on('error', (error) => {
      console.log('error', error);
    });

    socket.on('disconnect', () => {
      console.log('disconnect');
      this.onSocketClosed();
    });
    
    socket.on('feed', (data) => {
      //console.log('feed', data);

      var trCallback = this.realCallbacks[data.header.trName];
      if (trCallback != null) {
        var keyCallback = trCallback[data.header.key];
        for (var compId in keyCallback) {
          var compCallback = keyCallback[compId];
          if (compCallback != null) {
            compCallback.call(this, data);
          }
        }
      }
    });

    socket.on('push', (data) => {
      //console.log('push', data);
      
      var trCallback = this.realPushCallbacks[data.header.trName];
      if (trCallback != null) {
        for (var compId in trCallback) {
          var compCallback = trCallback[compId];
          if (compCallback != null) {
            compCallback.call(this, data);
          }
        }
      }
    });

    socket.on('query', (data) => {
      //console.log('query', data);

      var packetId = data.header.packetId;
      var cbObj = this.getQueryCallback(packetId);
      if (cbObj.func) {
        cbObj.func(data);
      }
    });
    
    this.socket = socket;
  }

  stopManager() {
    if (this.netIo) this.netIo.stopIO();
    this.serverStarted = false;
    this.onClosed();
  }

  setNetworkIo(netIo) {
    this.netIo = netIo;
  }

  setQueryCallback(key, callback) {
    this.queryCallbacks[key] = callback;
  }

  getQueryCallback(key) {
    var callback = this.queryCallbacks[key];
    if (callback) {
      if (callback.timeout) {
        clearTimeout(callback.timeout);
        callback.timeout = null;
      }

      if (!callback.noDelete) delete this.queryCallbacks[key];
    }

    return callback;
  }

  clearAllQueryCallback() {
    var callback, key;
    for (key in this.queryCallbacks) {
      callback = this.queryCallbacks[key];

      if (callback.timeout) {
        clearTimeout(callback.timeout);
        callback.timeout = null;
      }
    }

    this.queryCallbacks = {};
  }

  clearAllRealCallbacks() {
    this.realCallbacks = {};    //.Feed 콜백함수
    this.realPushCallbacks = {};//.Push 콜백함수
  }

  //second
  setTimeout(timeoutSec) {
    this.timeoutSec = timeoutSec;
  }

  getLastError(key) {
    if (key) return this.errorData[key];
    else return this.errorData;
  }

  getLastPacketInfo(key) {
    if (key) return this.packetInfo[key];
    else return this.packetInfo;
  }

  printLastError(key) {
    if (key) return afc.log(key + ':' + this.errorData[key]);
    else return afc.log(JSON.stringify(this.errorData, undefined, 2));
  }

  //---------------------------------------------------------
  //	listener functions
  //	function afterRecvBufferData(QueryManager);				* 수신버퍼에 데이터를 수신한 후 바로 호출된다.
  //	function afterOutBlockData(queryData, QueryManager);	* 수신된 데이터를 AQueryData 에 채운 후 호출된다.
  //	function beforeInBlockBuffer(queryData, groupName);		* 전송버퍼에 데이터를 채우기 전에 호출된다.
  //	function beforeSendBufferData(QueryManager);			* 전송버퍼의 데이터를 전송하기 바로 전에 호출된다.

  procRegisterReal(trName, keyArr, compId, callback) {
    //console.log("procRegisterReal compId[%s] trName[%s] key: ", compId, aquery.getName(), keyArr);

    var regArr = [];
    for (var i = 0; i < keyArr.length; i++) {
      var key = keyArr[i];
      if (key !== "") {
        var tr = this.realCallbacks[trName];
        if (tr != null) {
          var symbol = tr[key];
          if (symbol != null) {
            this.realCallbacks[trName][key][compId] = callback;
          } else {
            this.realCallbacks[trName][key] = {};
            this.realCallbacks[trName][key][compId] = callback;
            regArr.push(key);
          }
        } else {
          this.realCallbacks[trName] = {};
          this.realCallbacks[trName][key] = {};
          this.realCallbacks[trName][key][compId] = callback;
          regArr.push(key);
        }
      }
    }

    //새롭게 등록할 정보가 있으면 서버로 등록전달
    if (regArr.length > 0) {
      console.log('%cregisterRealFeed', 'color:red', compId, trName, regArr);
      this.sendRealSet(trName, true, regArr);
    }
  }
  procRegisterRealPush(trName, compId, callback) {
    
    //console.log("procRegisterRealPush compId[%s] qryName[%s]", compId, aquery.getName());

    var tr = this.realPushCallbacks[trName];
    if (tr != null) {
      this.realPushCallbacks[trName][compId] = callback;
    } else {
      this.realPushCallbacks[trName] = {};
      this.realPushCallbacks[trName][compId] = callback;
    }
    console.log('%cregisterRealPush', 'color:red', compId, trName);
  }
  registerReal(trName, type, keyArr, compId, callback) {
    if (type == '.Push') {
      this.procRegisterRealPush(trName, compId, callback);
    } else {
      this.procRegisterReal(trName, keyArr, compId, callback);
    }
  }

  procUnregisterReal(trName, keyArr, compId) {
    //console.log("procUnregisterReal compId[%s] qryName[%s] key: ", compId, aquery.getName(), keyArr);

    var regArr = [];
    for (var i = 0; i < keyArr.length; i++) {
      var key = keyArr[i];
      if (key !== "") {
        var tr = this.realCallbacks[trName];
        if (tr != null) {
          var symbol = tr[key];
          if (symbol != null) {
            if (symbol[compId] != null) {
              symbol[compId] = null;

              //2019.5.2 LJH, trName, key에 대하여 모든 컴포넌트 해지체크
              var subCheck = false;
              for (var j in symbol) {
                if (symbol[j] != null) {
                  subCheck = true;
                  break;
                }
              }
              if (subCheck === false) {
                //trName, key에 대하여 모든 컴포넌트가 해지되었음 / 서버로 해지전달
                this.realCallbacks[trName][key] = null;
                regArr.push(key);
              } else {
                //console.log('not unregisterRealFeed using', compId, trName, key, '');
              }
            } else {
              //console.log("not unregisterRealFeed", trName, key, compId);
            }
          } else {
            //console.log("not unregisterRealFeed", trName, key);
          }
        } else {
          //console.log("not unregisterRealFeed", trName);
        }
      }
    }

    //새롭게 해제할 정보가 있으면
    if (regArr.length > 0) {
      console.log('%cunregisterRealFeed', 'color:blue', compId, trName, regArr);
      this.sendRealSet(trName, false, regArr);
    }
  }
  procUnregisterRealPush(trName, compId) {
    
    //console.log("procUnregisterRealPush compId[%s] qryName[%s]", compId, aquery.getName());

    var tr = this.realPushCallbacks[trName];
    if (tr != null) {
      if (tr[compId] != null) {
        this.realPushCallbacks[trName][compId] = null;
        console.log('%cunregisterRealPush', 'color:blue', compId, trName);
      } else {
        //console.log("not unregisterRealPush", trName, compId);
      }
    } else {
      //console.log("not unregisterRealPush", trName, compId);
    }
  }
  unregisterReal(trName, type, keyArr, compId) {
    if (type == '.Push') {
      this.procUnregisterRealPush(trName, compId);
    } else {
      this.procUnregisterReal(trName, keyArr, compId);
    }
  }

  getHeaderInfo(headerKey) {
    if (headerKey) return this.headerInfo[headerKey];
    else return this.headerInfo;
  }

  setHeaderInfo(headerInfo) {
    if (headerInfo) {
      for (var p in headerInfo) {
        if (!headerInfo.hasOwnProperty(p)) continue;
        this.headerInfo[p] = headerInfo[p];
      }
    }
    //파라미터가 null 인 경우 초기화
    else {
      this.headerInfo = {
        PBLC_IP_ADDR: '', // 공인 IP		//10.110.51.182
        PRVT_IP_ADDR: '', // 사설 IP		//10.110.51.182
        MAC_ADR: '', // Mac 주소		//6C626D3A60C9
        TMNL_OS_TCD: 'PC', // 단말 OS 구분 코드 MS Win:"PC" MAC:"MC" AND:"AP" IPHONE:"IP" IPAD:"ID" AND PAD:"AD" 기타:"ZZ"
        TMNL_OS_VER: '', // 단말 OS 버전
        TMNL_BROW_TCD: '', // 단말 브라우저 구분 코드 익스플로러:"IE" 사파리:"SF" 파이어폭스:"FX" 크롬:"CR" 오페라:"OP" WEBKIT:"WK" 기타:"ZZ"
        TMNL_BROW_VER: '' // 단말 브라우저 버전
      }
    }
  }

  onConnected(success) {
    //afc.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ onConnected');
    console.log('onConnected');
  }

  onClosed() {
    //afc.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ onClosed');
    console.log('onClosed');
    this.clearAllQueryCallback();  

    // TODO: 재접속 처리 로직 
    // 	if(!this.selfClose && !theApp.isPause)
    // 		theApp.autoLoginProcess('재접속중입니다...');
  }

  //############################################################################################################################################
  // 상속받아 오버라이드 해야하는 함수들


  //상속 받아 다음과 같은 패턴으로 구현한다.
  onReceived(data, size) {
    //----------------------------------------------------

    //	1. this.rcvBuf 를 생성한다. 생성방법은 상황에 따라 다름.
    //	this.rcvBuf.setBuffer(data);
    //	this.rcvBuf.setDataSize(size);

    //	2. 패킷 타입과 패킷 아이디를 셋팅한다.
    //	this.packetInfo.packetType = this.rcvBuf.getByte(OS_COMM_CMD);
    //	this.packetInfo.packetId = this.rcvBuf.getByte(OS_COMM_ID);

    //	3. 패킷 타입에 따라 처리 함수를 분기한다.
    //	switch(this.packetInfo.packetType)
    //	{
    //		case 1: this.queryProcess();
    //	}

    //----------------------------------------------------
  }

  //헤더 이후의 데이터 셋팅 오프셋을 리턴한다.
  getInDataOffset() {
    return 0;
  }

  getOutDataOffset() {
    return 0;
  }

  //사용할 AQueryData 객체를 생성하여 리턴한다.
  makeQueryData(aquery, isSend) {
    return new AQueryData(aquery);
  }

    //onReceive 함수 내에서 패킷 타입에 따라 분기하여 호출되는 함수
  realProcess() {
    //----------------------------------------------------

    //	1. 쿼리 네임을 얻어 queryData 를 생성한다.
    //	var qryName = this.rcvBuf.nextOriString(4),
    //		aquery = AQuery.getSafeQuery(qryName),
    //		queryData = this.makeQueryData(aquery);

    //	2. queryData 객체에 값을 채우고 dataKey 값을 구한 후
    //	queryData.outBlockData(this.rcvBuf, offset);

    //	3. realDataToComp 함수를 호출한다.

    //----------------------------------------------------

  }

  makeHeader(queryData, abuf, menuNo) {

  }

  // 데이터 수신시 에러정보를 세팅하는 함수
  setErrorData(cbObj) {
    //----------------------------------------------------

    //	* rcvBuf에서 에러데이터에 해당하는 정보를 뽑아 저장한다.
    //	this.errorData.errCode = this.rcvBuf.getString(OS_ERR_CODE, SZ_ERR_CODE);
    //	this.errorData.errMsg = this.rcvBuf.getString(OS_ERR_MSG, SZ_ERR_MSG);
    //		...
    //		etc
    //----------------------------------------------------
  }


  // 여기까지 
  //############################################################################################################################################



  //asoocool dblTostr
  enableDTS() {
    this.dblTostr = true;
  }


  // 전문 수신 후 프로세스
  queryProcess() {
    //##########################################	
    //if(this.isShowProgress) AIndicator.hide();
    //##########################################


    var dataSize = this.rcvBuf.getDataSize(),
      cbObj = this.getQueryCallback(this.packetInfo.packetId);

    // 타임아웃 발생시 콜백객체를 제거하므로 체크
    if (!cbObj) return;

    //패킷 정보 셋팅
    this.packetInfo.menuNo = cbObj.menuNo;
    this.packetInfo.groupName = cbObj.groupName;
    this.packetInfo.trName = cbObj.trName;

    //에러 메시지 셋팅
    this.errorData.trName = cbObj.trName;
    this.errorData.errCode = '';
    this.errorData.errMsg = '';
    this.setErrorData();


    //수신된 전문 로그 남기는 함수, 개발시에만 호출
    //this.recv_log_helper();

    var listener, i, qLen = this.queryListeners.length;

    //버퍼에 데이터를 수신한 후 바로 호출된다.
    //######## afterRecvBufferData
    for (i = 0; i < qLen; i++) {
      listener = this.queryListeners[i];
      if (listener.afterRecvBufferData) listener.afterRecvBufferData(this);
    }
    //########

    var queryData = null,
      aquery = AQuery.getSafeQuery(cbObj.trName);

    if (!aquery) {
      //if(this.isShowProgress) AIndicator.hide();

      alert('onReceive : ' + cbObj.trName + ' query is not found.');
      return;
    }

    var dataOffset = this.getOutDataOffset(aquery);

    //tr, size LJH 2019.2.8
    // if(dataSize-dataOffset-1 > 20000) {
    //   console.log("queryProcess qryName[%s] length[%d]", cbObj.trName, dataSize-dataOffset-1);
    // }

    //body data 가 있는 경우만
    if (dataSize > dataOffset) {
      queryData = this.makeQueryData(aquery);

      //asoocool dblTostr
      queryData.dblTostr = cbObj.dblTostr;

      //queryData 객체에 전문데이터를 세팅
      queryData.outBlockData(this.rcvBuf, dataOffset);
    }

    //타임 아웃 이후에 패킷이 도착하거나 
    //계정계 지연 패킷이 올수 있으므로 콜백 객체가 없어도 계속 진행한다.
    //계정계 지연 패킷은 listener 의 afterOutBlockData 함수에서만 구현 가능한다.
    if (cbObj && cbObj.func) cbObj.func.call(this, queryData);

    //수신된 데이터를 AQueryData 에 채운 후 호출된다.
    //######## afterOutBlockData
    for (i = 0; i < qLen; i++) {
      listener = this.queryListeners[i];
      if (listener.afterOutBlockData) listener.afterOutBlockData(queryData, this);
    }
    //########

    if (queryData) {
      //afterOutBlockData 함수에서 enableLazyUpdate 함수를 호출하면 화면 업데이트를 비동기 함수 호출후에 할 수 있다.
      //차후 비동기 함수 콜백에서 queryData.lazyUpdate(); 함수를 호출해 준다.

      // console.log('======================================================================')
      // console.log(queryData.aquery.query.name, queryData.queryObj)
      // console.log('======================================================================')

      if (queryData.isLazyUpdate) queryData.lazyUpdate = _updateFunc;
      else _updateFunc();
    }else{
      // console.log('======================================================================')
      // console.log(queryData.aquery.query.name, 'queryData NULL')
      // console.log('======================================================================')
    }

    //-----

    function _updateFunc() {
      var compArray = aquery.getQueryComps(cbObj.menuNo, 'output');

      if (compArray) {
        var qryComp;
        for (var i = 0; i < compArray.length; i++) {
          qryComp = compArray[i];

          //비활성화된 탭은 적용되지 않도록
          //var tab = qryComp.getRootView().tab;
          //if(tab && $(tab.content).is(':hidden')) continue;

          var item = qryComp.getRootView().item;
          if (item && $(item).is(':hidden')) continue;


          //groupName 을 지정해 줬으면 같은 그룹네임인지 비교
          if (cbObj.groupName != '' && cbObj.groupName != qryComp.getGroupName()) continue;

          qryComp.updateComponent(queryData);
        }
      }
    }

    //##########################################	
    //if(this.isShowProgress) AIndicator.hide();
    //##########################################

  }

  //siseProcess 함수에서 호출한다 / 콜백함수 호출
  realDataToComp(key, queryData) {
    queryData.isReal = true;
    var trCallback = this.realCallbacks[queryData.aquery.getName()];
    if (trCallback != null){
      var keyCallback = trCallback[key];
      for (var compId in keyCallback) {
        var compCallback = keyCallback[compId];
        if (compCallback != null) {
          compCallback.call(this, queryData);
        }
      }
    }
  }

  //pushProcess 함수에서 호출한다 / 콜백함수 호출
  realPushDataToComp(queryData) {
    queryData.isReal = true;
    var trCallback = this.realPushCallbacks[queryData.aquery.getName()];
    if (trCallback != null){
      for (var compId in trCallback) {
        var compCallback = trCallback[compId];
        if (compCallback != null) {
          compCallback.call(this, queryData);
        }
      }
    }
  }

  sendProcessByName(header, input, outputCallBack) {

    console.log('sendProcessByName', header, input.InBlock1[0]);

    const packetId = this.makePacketId();
    var cbObj = {
      trName: header.trName,
      func: outputCallBack,
      timeout: null
    };
    this.setQueryCallback(packetId, cbObj);
    header.packetId = packetId;

    let sendData = {};
    sendData.header = header;
    sendData.data = input;
    
    this.socket.emit('query', sendData);

    //timeout 필요
  }

  makePacketId() {
    return ++this.packetId;
  }

  addSkipErrorCode(qryName, errorCode) {
    var array = this.errCodeMap[qryName];
    if (!array) array = this.errCodeMap[qryName] = [];

    for (var i = 0; i < array.length; i++)
      if (array[i] == errorCode) return;

    array.push(errorCode);
  }

  removeSkipErrorCode(qryName, errorCode) {
    var array = this.errCodeMap[qryName];
    if (!array) return;

    for (var i = 0; i < array.length; i++) {
      if (array[i] == errorCode) {
        array.splice(i, 1);
        if (array.length == 0) delete this.errCodeMap[qryName];

        return;
      }
    }
  }

  isSkipErrorCode(qryName, errorCode) {
    var array = this.errCodeMap[qryName];
    if (!array) return false;

    for (var i = 0; i < array.length; i++) {
      if (array[i] == errorCode)
        return true;
    }

    return false;
  }

  clearRealProcess(queryName, menuNo, realQuery) {
    var key = menuNo + queryName + realQuery,
      dataKeyArr = this.realProcMap[key];

    if (dataKeyArr) delete this.realProcMap[key];
    else dataKeyArr = [];

    this.unregisterReal(realQuery, dataKeyArr, menuNo);
  }

  //2019.4.30 LJH, RealPush 등록/해지 정의
  registerRealPush(key) {
    this.sendRealPushSet(true, key);
  }
  unregisterRealPush(key) {
    this.sendRealPushSet(false, key);
  }

  sendRealSet(trName, isSet, regArr) {
		this.socket.emit('feed', {
			trName: trName,
			isSet: isSet,
			regArr: regArr
		});
	}

	//2019.4.30 LJH, RealPush 등록/해지 패킷 생성
	sendRealPushSet(isSet, key) {
		this.socket.emit('push', {
			key: key,
			isSet: isSet
		});
  }
  
  pollingProcess() {
    console.log("polling");
    this.socket.emit('polling');
  }

  sendXtLoginData(userInfo) {
    console.log("go login socket");
		this.socket.emit('login', userInfo);
  }
  
  sendXtLogoutData() {
    console.log("go logout socket");
		this.socket.emit('logout');
	}
}
