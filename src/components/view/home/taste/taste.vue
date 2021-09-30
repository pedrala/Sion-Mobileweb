<template>
  <div style="display:flex; flex-direction: column; flex:1; overflow: hidden;">
      <div ref="chart" class="chart_cont_bx">
        <div class="chart-wrap">
          <div class="chart-header">
            <div class="chart-header-title">
              <span>BINANCE</span>
              <h4>BTCUSDT</h4>
              <span>비트코인</span>
            </div>
            <div class="chart-header-price">
              <div class="chart-header-price-current">
                <span :style="{ color: gb=='+'?'#f8696b':gb=='-'?'#409EFF':'' }"> <font style="font-size:15px;"> {{ curPrice | numberFormat2 }}</font></span>
                <span class="unit">USDT</span>
              </div>
              <div class="chart-header-price-pre down">전일대비
                <span :style="{ color: gb=='+'?'#f8696b':gb=='-'?'#409EFF':'' }">{{ upDnRate }}%</span>
                <span v-if="gb=='+'" style="color: #f8696b">
                  <i class="el-icon-caret-top"></i>
                  {{ diff | numberFormat2 }}
                </span>
                <span v-else-if="gb=='-'" style="color: #409EFF">
                  <i class="el-icon-caret-bottom"></i>
                  {{ diff | numberFormat2 }}
                </span>
                <span v-else>
                  {{ diff | numberFormat2 }}
                </span>
              </div>
            </div>
          </div>
          <div class="date-unit">
            <el-radio-group v-model="timeUnit" @change="timeUnitChange" size="mini">
              <el-radio-button label="5"> 틱</el-radio-button>
              <el-radio-button label="1"> 분</el-radio-button>
              <el-radio-button label="2"> 일</el-radio-button>
              <el-radio-button label="3"> 주</el-radio-button>
              <el-radio-button label="4"> 월</el-radio-button>
            </el-radio-group>
          </div>

          <div ref="minichart">
            <app-chart style="height:200px;" v-if="offset" :symbol="symbol" :offset="offset" chartDivName="diagnosis"></app-chart>
          </div>

        </div>
      </div>
      <div style="flex:1; display: flex; overflow: hidden; margin:10px 10px 0 10px; border:1px solid #CCC;">
        <sionScore :symbol="symbol" style="flex:6;" direction="taste"></sionScore>
        <tech-indi-diag style="flex:4; margin-left: 5px;" :symbol="symbol" direction="taste"></tech-indi-diag>
      </div>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  components: {
    AppChart: () => import(/* webpackPrefetch: true */ '@/components/view/common/appChart'),
    sionScore: () => import(/* webpackPrefetch: true */ '@/components/view/sise/diag/sionScore'),
    techIndiDiag: () => import(/* webpackPrefetch: true */ '@/components/view/sise/diag/techIndiDiag')
  },
  data() {
    return {
      beforeSymbol: '',
      timeUnit:2, //기본 일봉 기준
      symbol: "00021BTCUSDT", //00001XBTUSD
      offset: null,

      //실시간조회
      cyc: '2', //초기값 일봉
      cycunit: '',
      qrycnt: '1',

      symbolKr: '',
      name: '',
      exchange:'',
      curPrice:'',
      upDnRate:'',
      diff:'',
      gb:'',

    };
  },
  computed: {
    ...mapGetters([ 'isMaster'])
  },
  methods: {

    timeUnitChange(){
       const self = this;
       self.onChangeCyc();
    },
    callbackTCS(queryData)
    {
        const self = this;
        // console.log("callbackTCS:"+queryData.header.trName, queryData.queryObj.OutBlock1[0].kshcode,queryData.queryObj.OutBlock1[0].price);

        let ob = queryData.queryObj.OutBlock1[0];
        self.curPrice = ob.price;
        // console.log("curPrice:"+JSON.stringify(self.curPrice));

        if ('45'.indexOf(ob.change[0]) >= 0) {
          self.gb = '-';
        } else if ('12'.indexOf(ob.change[0]) >= 0) {
          self.gb = '+';
        } else {
          self.gb = '';
        }

        self.diff = ob.change.substr(1);
        self.upDnRate = ob.drate;
        // console.log("diff:"+JSON.stringify(self.diff));
        // console.log("updnrate:"+JSON.stringify(self.updnrate));

    },
    getData() {
      const self = this;

      let header = { trName: 'm1323' };
      let input = {
        InBlock1: [{
          symbol: self.symbol,
          cycunit: self.timeUnit,
          qrycnt: self.qrycnt,
          cyc: self.cyc, //분(1), 일(2), 주(3), 월(4), 틱(5)
          availflag: '',
          sdate: '',
          edate: '',
          datetype: '0', //한국시간 기준(0), GMT시간 기준(1)
          bojomsg: '',   //최초 조회시 space, 연속조회시 이전 OutBlock1의 보조메세지
        }]
      }

     console.log("m1323_input:"+JSON.stringify(input));
      self.$socket.sendProcessByName(header, input, function(queryData) {
        if (queryData) {
            //  console.log("m1323_output:"+JSON.stringify(queryData));
          if (queryData.queryObj) {
            if (queryData.queryObj.OutBlock1 && queryData.queryObj.OutBlock1.length > 0) {

              let block = queryData.queryObj.OutBlock1[0];

              self.upDnRate = block.updnrate;
              self.diff = block.diff;
              self.curPrice = parseFloat(block.yesterdayprice)+parseFloat(block.diff);
              self.gb = block.diff>0?'+':block.diff<0?'-':'';
              //realRegister
              self.$socket.registerReal("TCS1", '.Feed', [ self.symbol ], "diag", self.callbackTCS);
              self.beforeSymbol = self.symbol;

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
    onChangeCyc() {
      const self = this;
      self.cycunit = '';
      let param = {
        cyc: self.timeUnit,
        cycunit: '',
      }
      // self.$message("changeCyc:"+self.timeUnit);
      self.$EventBus.$emit("changeCyc", param);
    },
  },
  created() {
  },
  mounted() {
    const self = this;

    self.$nextTick(() => {
      self.offset = {
        left: self.$refs.minichart.offsetLeft,
        top: self.$refs.minichart.offsetTop+45,
        width: self.$refs.minichart.offsetWidth,
        height: 200//height: self.$refs.minichart.offsetHeight
      }
      if (self.isMaster) {
        self.getData();
      }
      self.$EventBus.$on("loadMaster", self.getData);
    })
  },
  beforeDestroy() {
    const self = this;

    if (self.beforeSymbol != '') {
      self.$socket.unregisterReal("TCS1", '.Feed', [ self.beforeSymbol ], "diag");
    }
    self.$EventBus.$off("loadMaster", self.getData);
  }
}
</script>

<style lang="scss" scoped>

</style>
