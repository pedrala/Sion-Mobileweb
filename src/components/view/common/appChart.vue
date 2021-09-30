<template>
  <div :id="chartDivName"></div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  props: [ 'symbol', 'offset', 'chartDivName' ],
  computed: {
    ...mapGetters([ 'isMaster', 'getSymbol' ])
  },
  data() {
    return {
      isShowChart: false,
      
      cyc: '2', //초기값 일봉
      cycunit: '',
      bojomsg: '',
      qrycnt: '200',
      downChartState: false,
    };
  },
  watch: {
    offset(val, old) {
      const self = this;
      
      var docWidth = $(window).width();
      var docHeight = $(window).height();

      var leftRate = self.offset.left / docWidth;
      var widthRate = self.offset.width / docWidth;
      var topRate = self.offset.top /docHeight;
      var heightRate = self.offset.height / docHeight;

      console.log("watch offset", docWidth, docHeight, self.offset.left, self.offset.top, self.offset.width, self.offset.height);

      var chartParams = [leftRate, topRate, widthRate, heightRate, self.chartDivName];
      if (typeof cordova !== 'undefined') {
        cordova.exec(null , null, "ChartPlugin" , "setChartSize", chartParams);
      }
    }
  },
  methods: {
    initAppChart: function () {
      const self = this;

      var docWidth = $(window).width();
      var docHeight = $(window).height();

      var leftRate = self.offset.left / docWidth;
      var topRate = self.offset.top / docHeight;
      var widthRate = self.offset.width / docWidth;
      var heightRate = self.offset.height / docHeight;

      // console.log("initAppChart", docWidth, docHeight, self.offset.left, self.offset.top, self.offset.width, self.offset.height);

      var loadChartName = '';
      if(self.chartDivName != 'diagnosis') { //맛보기 차트 저장 안함
        loadChartName = self.chartDivName;
      }

      var beforeOptions = {
        "ChartType": '',          //"compare","multi"
        "LoadChart" : loadChartName,         //"stock","future","stockfuture","nightfuture","multi","compare"
        "MarketCategory" : '',    //"0:주식,"1:선물,"2:옵션,"3:ELW,"4":업종지수,"5":선물지수,"6":해외지수,"7":해외선물,"8":해외주식
        "PeriodType" : 1,         //"0":틱,"1":분,"2":일,"3":주,"4":월,"5":년
        "PeriodTime" : 60,        //1~60
        "IsXScale" : false,
        "IsYScale" : false,
        "Locale" : self.$i18n.locale=='en'?'eng':'kor'
      };

      var afterOptions = {
        "AccrueName": '',
        "AccrueData": ''
      };

      beforeOptions["ChartColor"] = ChartManager.chartColorWhite;
      beforeOptions["ChartColor"][0] = "ff5252"; //"ff0000", //75: 상승
      beforeOptions["ChartColor"][1] = "627bfe"; //"0070ff", //76: 하락
      
      var params = [
        leftRate,
        topRate,
        widthRate,
        heightRate,
        self.chartDivName,
        beforeOptions,
        afterOptions
      ];
      
      if (typeof cordova !== 'undefined') {
        cordova.exec( null , null, "ChartPlugin" , "loadChartLayout", params);                
      }
      ChartManager.setDelegator(self);
              
    },
    //네이티브 차트가 생성되는 시점에 호출되는 함수
    onChartInit: function (chartId) {
      console.log("onChartInit_____________");

      const self = this;
      // if (typeof window.cordova !== 'undefined') {
        // window.cordova.exec( null, null, "ChartPlugin" , "setTransparent", [ self.chartDivName, "1"]);
      // }
      //downChart 상태일 경우 그리지 않도록 처리
      if(self.downChartState) {
        if (typeof cordova !== 'undefined') {
          ChartManager.bringToFront(true);
        }
      } else {
        if (typeof cordova !== 'undefined') {
          ChartManager.bringToFront(false);
        }
      }
      self.isShowChart = true;
      self.getData();
    },
    onScrollEnd : function () {
      const self = this;
      if( self.bojomsg == '') {
        return;
      }
      // self.$message("self.bojomsg:"+self.bojomsg);
      let header = { 
        trName: 'm1323',
        continueKey:  self.bojomsg
      };
      let input = {
        InBlock1: [{
          symbol: self.symbol,
          cycunit: self.cycunit,
          qrycnt: self.qrycnt,
          cyc: self.cyc,          //분(1), 일(2), 주(3), 월(4), 틱(5)
          availflag: '',
          sdate: '',
          edate: '',
          datetype: '0',          //한국시간 기준(0), GMT시간 기준(1)
          bojomsg: self.bojomsg,  //최초 조회시 space, 연속조회시 이전 OutBlock1의 보조메세지
        }]
      }
      self.$socket.sendProcessByName(header, input, function(queryData) {
        if (queryData) {
          if (queryData.queryObj) {
            if (queryData.queryObj.OutBlock1 && queryData.queryObj.OutBlock1.length > 0) {

              let block = queryData.queryObj.OutBlock1[0];
              self.bojomsg = block.bojomsg;
              let curPrice = parseFloat(block.yesterdayprice)+parseFloat(block.diff);
              var realData = {
                'D1에러여부': false,
                'D1초기화여부': true,
                'D1현재가': curPrice,
                'D1데이터개수': block.out_cnt,
                'D1단축코드': block.symbol,
                'D1종목명': self.getSymbol(block.symbol).name,
                'D1시장분류코드': 0,
                'D1등락구분': parseFloat(block.diff)>0?"2":parseFloat(block.diff)<0?"5":"", //등락 구분코드("2", "5", "")
                'D1대비': block.diff,                //전봉 or 전일 대비 가격
                'D1등락율': block.updnrate,          //전봉 or 전봉 대비 등락률
                'D1거래량_30608과동일': "",          //거래량
                'D1거래대금_30609과동일': "",        //거래대금
                'D1기준가': block.yesterdayprice,   //기준가(일주월-현재가, 분틱-당일시가)
                'D1전일종가': block.yesterdayprice, //전봉종가
                'D1초기화여부': false,              //초기화 시 차트 데이터 지워짐
                "D1연속여부": 1                     //연속여부
              };

              var chartData = {
                "ref" : realData,
                "data": queryData.queryObj.OutBlock2
              };

              if (typeof cordova !== 'undefined') {
                cordova.exec( null , null, "ChartPlugin" , "updateOutputData", [ self.chartDivName, chartData ]); //앱차트
              }

              //당일 시고저종 전일 시고저종
              // try {
              //   var sValue = block.curopenprc+"="+block.curhighprc+"="+block.curlowprc+"="+curPrice+"="+block.preopenprc+"="+block.prehighprc+"="+block.prelowprc+"="+block.yesterdayprice;
              //   ChartManager.setGijunData([ self.name, sValue ]);
              // } catch(err) {
              //   console.error(err);
              // }
            } else {
              console.error("m1323 OutBlock1 is null");
            }
          } else {
            console.error(queryData.header);
          }
        } else {
          console.error("m1323 is null");
        }
      });
    },
    //차트에서 데이터 요청
    onRequestData : function(requestArr, selectedIndex) {
      // self.$message("onRequestData selectedIndex" +  selectedIndex);
      // self.$message("onRequestData requestArr"+ requestArr);

      // var code = requestArr[0];	//종목코드
      var code = this.$store.state.data.currentSymbol;
      //var name = requestArr[1];	//종목명
      //var mid = requestArr[2];	//시장구분
      var type = requestArr[3];	//주기
      var term = (requestArr[4]) ? requestArr[4] : 1;	//분틱주기값

      var ijwb= '';
      if (type == '7') {
          ijwb = '4';
      } else if (type == '6') {
          ijwb = '5';                
      } else {
          ijwb = type;
      }

      self.symbol = code;
      self.cycunit = term;
      self.cyc = type; //분(1), 일(2), 주(3), 월(4), 틱(5)

      self.getData();
    },
    //차트에서 분틱 설정 값 변경
    onChangePeriodOnStorage: function(minList, tickList) {

    },
    //네이티브 차트 조회 갯수 변경 기능
    onByNumber: function (viewNum) {
      const self = this;
      // self.$message("viewNum:"+viewNum);
      self.qrycnt = viewNum;
      self.$socket.unregisterReal("TCS1", '.Feed', [ self.symbol ], "AppChart");
      self.getData();
    },    
    showDataList(val) {
      const self = this;
      console.log("showDataList", val);
			if (typeof cordova !== 'undefined') {
        var params= [ self.chartDivName, val ];
				ChartManager.setShowCrossLine(params);
			}
		},
    showModalSetting() {
      const self = this;
      console.log("showModalSetting");
			if (typeof cordova !== 'undefined') {
        var params= [ self.chartDivName, self.$parent.$el, "indicator" ];
				ChartManager.openDlg(params);
			}
		},
    showToolBar() {
      const self = this;
      console.log("showToolBar");
			if (typeof cordova !== 'undefined') {
        var params= [ self.chartDivName, self.$parent.$el, "tools" ];
				ChartManager.openDlg(params);
			}
		},
    upChart() {
      console.log("upChart");
      const self = this;
      self.downChartState = false;
      if (typeof cordova !== 'undefined') {
				ChartManager.bringToFront(false);
      }
		},
		downChart() {
      console.log("downChart");
      const self = this;
      self.downChartState = true;
			if (typeof cordova !== 'undefined') {
				ChartManager.bringToFront(true);
			}
    },
    changeCyc(param) {
      console.log("changeCyc.", param);
      
      const self = this;
      self.cyc = param.cyc;
      self.cycunit = param.cycunit;

      self.$socket.unregisterReal("TCS1", '.Feed', [ self.symbol ], "AppChart");
      self.getData();
    },
    callbackTCS1(queryData) {
      // console.log(queryData.header.trName, queryData.queryObj.OutBlock1[0].kshcode);
      
      const self = this;
      if (typeof cordova !== 'undefined') {
        cordova.exec( null , null, "ChartPlugin" , "updateRealData", [ self.chartDivName, queryData.queryObj.OutBlock1 ]);
      }
    },
    setPeriod() {
      const self = this;
      // edaily -> appchart
      let type = '';
      let term = '1';
      if (self.cyc == '1') {
        //분봉
        type = '6';
        term = self.cycunit;
      } else if (self.cyc == '2') {
        //일봉
        type = '1';
      } else if (self.cyc == '3') {
        //주봉
        type = '2';
      } else if (self.cyc == '4') {
        //월봉
        type = '3';
      } else if (self.cyc == '5') {
        //틱
        type = '7';
        term = self.cycunit;
      }
      if (type != '') {
        if (typeof cordova !== 'undefined') {
          ChartManager.setPeriod([ self.chartDivName, type, term ]);
        }
      }
    },
    getData() {
      const self = this;
      console.log("appChart_getData.");
      self.setPeriod();

      let header = { trName: 'm1323' };
      let input = {
        InBlock1: [{
          symbol: self.symbol,
          cycunit: self.cycunit,
          qrycnt: self.qrycnt,
          cyc: self.cyc, //분(1), 일(2), 주(3), 월(4), 틱(5)
          availflag: '',
          sdate: '',
          edate: '',
          datetype: '0', //한국시간 기준(0), GMT시간 기준(1)
          bojomsg: '',   //최초 조회시 space, 연속조회시 이전 OutBlock1의 보조메세지
        }]
      }

      self.$socket.sendProcessByName(header, input, function(queryData) {
        if (queryData) {
          if (queryData.queryObj) {
            if (queryData.queryObj.OutBlock1 && queryData.queryObj.OutBlock1.length > 0) {

              let block = queryData.queryObj.OutBlock1[0];
              self.bojomsg = block.bojomsg;
              let curPrice = parseFloat(block.yesterdayprice)+parseFloat(block.diff);
              var realData = {
                'D1에러여부': false,
                'D1초기화여부': true,
                'D1현재가': curPrice,
                'D1데이터개수': block.out_cnt,
                'D1단축코드': block.symbol,
                'D1종목명': self.getSymbol(block.symbol).name,
                'D1시장분류코드': 0,
                'D1등락구분': parseFloat(block.diff)>0?"2":parseFloat(block.diff)<0?"5":"", //등락 구분코드("2", "5", "")
                'D1대비': block.diff,                //전봉 or 전일 대비 가격
                'D1등락율': block.updnrate,          //전봉 or 전봉 대비 등락률
                'D1거래량_30608과동일': "",          //거래량
                'D1거래대금_30609과동일': "",        //거래대금
                'D1기준가': block.yesterdayprice,   //기준가(일주월-현재가, 분틱-당일시가)
                'D1전일종가': block.yesterdayprice, //전봉종가
                'D1초기화여부': true,               //초기화 시 차트 데이터 지워짐
                "D1연속여부": 0,                     //연속여부
                "D1가격소수점자리수": self.getSymbol(block.symbol).digits //마스터정보 소수점자리수
              };

              var chartData = {
                "ref" : realData,
                "data": queryData.queryObj.OutBlock2
              };

              console.log("appChart_updateOutputData:"+cordova);
              if (typeof cordova !== 'undefined') {
                cordova.exec( null , null, "ChartPlugin" , "updateOutputData", [ self.chartDivName, chartData ]); //앱차트
              }

              //당일 시고저종 전일 시고저종
              if (typeof cordova !== 'undefined') {
                var sValue = block.curopenprc+"="+block.curhighprc+"="+block.curlowprc+"="+curPrice+"="+block.preopenprc+"="+block.prehighprc+"="+block.prelowprc+"="+block.yesterdayprice;
                ChartManager.setGijunData([ self.chartDivName, sValue ]);
              }

              //registerReal
              self.$socket.registerReal("TCS1", '.Feed', [ self.symbol ], "AppChart", self.callbackTCS1);
            } else {
              console.error("m1323 OutBlock1 is null");
            }
          } else {
            console.error(queryData.header);
          }
        } else {
          console.error("m1323 is null");
        }
      });
    },
  },
  created() {
    const self = this;
    self.$EventBus.$on('showDataList', self.showDataList);
    self.$EventBus.$on('showModalSetting', self.showModalSetting);
    self.$EventBus.$on('showToolBar', self.showToolBar);
    self.$EventBus.$on('upChart', self.upChart);
    self.$EventBus.$on('downChart', self.downChart);
    self.$EventBus.$on('changeCyc', self.changeCyc);
  },
  mounted() {
    const self = this;
    console.log("appChart_mounted.");
    window.document.addEventListener('deviceready', ()=> {
      console.log('appChart mounted deviceready');
       self.$nextTick(() => {
        if (self.isMaster) {
          self.initAppChart();
        }
        self.$EventBus.$on("loadMaster", self.initAppChart);
      })
    })
  },
  beforeDestroy() {
    const self = this;
    self.$EventBus.$off('showDataList', self.showDataList);
    self.$EventBus.$off('showModalSetting', self.showModalSetting);
    self.$EventBus.$off('showToolBar', self.showToolBar);
    self.$EventBus.$off('upChart', self.upChart);
    self.$EventBus.$off('downChart', self.downChart);
    self.$EventBus.$off('changeCyc', self.changeCyc);
    
    self.$EventBus.$off("loadMaster", self.initAppChart);

    self.$socket.unregisterReal("TCS1", '.Feed', [ self.symbol ], "AppChart");

    //모바일 차트
    if (typeof cordova !== 'undefined') {
      ChartManager.destroyAll();
    }
  }
}
</script>
