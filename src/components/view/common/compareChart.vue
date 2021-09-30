<template>
  <div :id="chartDivName"></div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  props: [ 'symbol1', 'symbol2', 'cycleType', 'offset', 'chartDivName' ],
  computed: {
    ...mapGetters([ 'isMaster', 'getSymbol' ])
  },
  data() {
    return {
      beforeSymbol1: '',
      beforeSymbol2: '',
      
      cyc: '', //초기값 일봉
      cycunit: '',

      qrycnt: '200',
      downChartState: false,
    };
  },
  watch: {
    symbol1(val, old) {
      const self = this;
      self.getCompareData();
    },
    symbol2(val, old) {
      const self = this;
      self.getCompareData();
    },
    cycleType(val, old) {
      const self = this;
      self.getCompareData();
    }
  },
  methods: {
    initAppChart: function () {
      const self = this;

      var docWidth = $(window).width();
      var docHeight = $(window).height();

      var leftRate = self.offset.left / docWidth;
      var topRate = self.offset.top /docHeight;
      var widthRate = self.offset.width / docWidth;
      var heightRate = self.offset.height / docHeight;

      console.log("compareChart", docWidth, docHeight, self.offset.left, self.offset.top, self.offset.width, self.offset.height);

      var beforeOptions = {
        "ChartType": 'compare',  //"compare","multi"
        "LoadChart" : '',         //"stock","future","stockfuture","nightfuture","multi","compare"
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
      beforeOptions["LineThick"] = "2";
      
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
      console.log("onChartInit________________");

      const self = this;      
      if (typeof cordova !== 'undefined') {
        //비교차트 종목 등록 : "code";"name";"market"
        // cordova.exec( null, null, "ChartPlugin" , "setTransparent", [ self.chartDivName, "1"]);
        cordova.exec( null , null, "ChartPlugin" , "setDataClear", ["Compare", "1"]);
        cordova.exec( null , null, "ChartPlugin" , "setCompareData", [ self.chartDivName, self.symbol1+";"+self.getSymbol(self.symbol1).coincd+" ("+self.getSymbol(self.symbol1).vexidnm+");0" ]);
        cordova.exec( null , null, "ChartPlugin" , "setCompareData", [ self.chartDivName, self.symbol2+";"+self.getSymbol(self.symbol2).coincd+" ("+self.getSymbol(self.symbol2).vexidnm+");0" ]);

        if(self.downChartState) {
          ChartManager.bringToFront(true);
        } else {        
          ChartManager.bringToFront(false);
        }
      }
      self.getData(self.symbol1, true);
      self.getData(self.symbol2, false);
    },
    //차트에서 데이터 요청
    // onRequestData : function(requestArr, selectedIndex) {
    //   const self = this; 
    //   // self.$message("onRequestData selectedIndex" +  selectedIndex);
    //   // self.$message("onRequestData requestArr"+ requestArr);

    //   var code = requestArr[0];	//종목코드
    //   var name = requestArr[1];	//종목명
    //   var mid = requestArr[2];	//시장구분
    //   var type = requestArr[3];	//주기
    //   var term = (requestArr[4]) ? requestArr[4] : 1;	//분틱주기값

    //   self.symbol = code;
    //   self.cycunit = term;
    //   self.cyc = type; //분(1), 일(2), 주(3), 월(4), 틱(5)

    //   if (self.beforeSymbol2 != '') {
    //     self.$socket.unregisterReal("TCS1", '.Feed', [ self.beforeSymbol2 ], "CompareChart2");
    //     self.beforeSymbol2 = '';
    //   }
    //   self.getData(code, false);
    // },
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
    callbackLeftTCS1(queryData) {
      // console.log(queryData.header.trName, queryData.queryObj.OutBlock1[0].kshcode);
      
      const self = this;
      if (typeof cordova !== 'undefined') {
        cordova.exec( null , null, "ChartPlugin" , "updateRealData", [ self.chartDivName, queryData.queryObj.OutBlock1 ]);
      }
    },
    callbackRightTCS1(queryData) {
      // console.log(queryData.header.trName, queryData.queryObj.OutBlock1[0].kshcode);
      
      const self = this;
      if (typeof cordova !== 'undefined') {
        cordova.exec( null , null, "ChartPlugin" , "updateRealData", [ self.chartDivName, queryData.queryObj.OutBlock1 ]);
      }
    },
    setPeriod() {
      const self = this;
      let type = '';
      let term = '1';

      if (self.cycleType == "1h") {
        //15s 1h (없음) -> 1m 1h
        type = '6';
        term = '1';
        self.cyc = '1';
        self.cycunit = '1';
        self.qrycnt = 60;
      } else if (self.cycleType == "24h") {
        //5m 24h
        type = '6';
        term = '5';
        self.cyc = '1';
        self.cycunit = '5';
        self.qrycnt = 288;
      } else if (self.cycleType == "7d") {
        //30m 7d
        type = '6';
        term = '30';
        self.cyc = '1';
        self.cycunit = '30';
        self.qrycnt = 336;
      } else if (self.cycleType == "30d") {
        //1d 30d
        type = '1';
        self.cyc = '2';
        self.qrycnt = 30;
      } else if (self.cycleType == "90d") {
        //1d 90d
        type = '1';
        self.cyc = '2';
        self.qrycnt = 90;
      } else if (self.cycleType == "1y") {
        //1d 360d
        type = '1';
        self.cyc = '2';
        self.qrycnt = 360;
      } else if (self.cycleType == "all") {
        //1w 2y
        type = '2';
        self.cyc = '3';
        self.qrycnt = 104;
      }
      
      if (type != '') {
        if (typeof cordova !== 'undefined') {
          ChartManager.setPeriod([ self.chartDivName, type, term ]);
        }
      }
    },
    getCompareData() {
      const self = this;

      //차트데이터 초기화
      if (typeof cordova !== 'undefined') {
        cordova.exec(null , null, "ChartPlugin" , "setDataClear", ["Compare", "1"]);
        cordova.exec( null , null, "ChartPlugin" , "setCompareData", [ self.chartDivName, self.symbol1+";"+self.getSymbol(self.symbol1).coincd+" ("+self.getSymbol(self.symbol1).vexidnm+");0" ]);
        cordova.exec( null , null, "ChartPlugin" , "setCompareData", [ self.chartDivName, self.symbol2+";"+self.getSymbol(self.symbol2).coincd+" ("+self.getSymbol(self.symbol2).vexidnm+");0" ]);
      }
      
      //리얼데이터 해지 (symbol1)
      if (self.beforeSymbol1 != '') {
        self.$socket.unregisterReal("TCS1", '.Feed', [ self.beforeSymbol1 ], "CompareChart1");
        self.beforeSymbol1 = '';
      }
      //리얼데이터 해지 (symbol2)
      if (self.beforeSymbol2 != '') {
        self.$socket.unregisterReal("TCS1", '.Feed', [ self.beforeSymbol2 ], "CompareChart2");
        self.beforeSymbol2 = '';
      }

      self.getData(self.symbol1, true); // symbol, isLeft
      self.getData(self.symbol2, false);// symbol, isLeft
    },
    getData(symbol, isLeft) {
      const self = this;      

      self.setPeriod();

      let header = { trName: 'm1323' };
      let input = {
        InBlock1: [{
          symbol: symbol,
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
            console.log("getData", queryData.queryObj);
            if (queryData.queryObj.OutBlock1 && queryData.queryObj.OutBlock1.length > 0) {

              let block = queryData.queryObj.OutBlock1[0];
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

              if (typeof cordova !== 'undefined') {
                cordova.exec( null , null, "ChartPlugin" , "updateOutputData", [ self.chartDivName, chartData ]); //앱차트
              }

              //당일 시고저종 전일 시고저종
              var sValue = block.curopenprc+"="+block.curhighprc+"="+block.curlowprc+"="+curPrice+"="+block.preopenprc+"="+block.prehighprc+"="+block.prelowprc+"="+block.yesterdayprice;
              if (typeof cordova !== 'undefined') {
                ChartManager.setGijunData([ self.chartDivName, sValue ]);
              }

              //registerReal
              if (isLeft) {
                self.beforeSymbol1 = symbol;
                self.$socket.registerReal("TCS1", '.Feed', [ symbol ], "CompareChart1", self.callbackLeftTCS1);
              } else {
                self.beforeSymbol2 = symbol;
                self.$socket.registerReal("TCS1", '.Feed', [ symbol ], "CompareChart2", self.callbackRightTCS1);
              }
              
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
    self.$EventBus.$on('upChart', self.upChart);
    self.$EventBus.$on('downChart', self.downChart);
  },
  mounted() {
    const self = this;
    self.$nextTick(() => {
      if (self.isMaster) {
        self.initAppChart();
      }
      self.$EventBus.$on("loadMaster", self.initAppChart);
    });    
  },
  beforeDestroy() {
    const self = this;
    self.$EventBus.$off('upChart', self.upChart);
    self.$EventBus.$off('downChart', self.downChart);

    self.$EventBus.$off("loadMaster", self.initAppChart);

    if (self.beforeSymbol1 != '') {
      self.$socket.unregisterReal("TCS1", '.Feed', [ self.beforeSymbol1 ], "CompareChart1");
    }
    if (self.beforeSymbol2 != '') {
      self.$socket.unregisterReal("TCS1", '.Feed', [ self.beforeSymbol2 ], "CompareChart2");
    }

    //모바일 차트
    if (typeof cordova !== 'undefined') {
      ChartManager.destroyAll();
    }
  }
}
</script>
