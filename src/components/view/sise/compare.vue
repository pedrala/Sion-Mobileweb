<template>
  <div style="display:flex; flex-direction: column; height: 100%;">
    <div class="chart_top_bx sise-header">
      <el-col :span="10">
        <!-- <el-select v-if="symbols" v-model="symbol1" @visible-change="onChangeCoin" size="small">
          <el-option v-for="(item, key) in symbols" :key="key" :value="item.symbol" :label="labelCoin(item)"></el-option>
        </el-select> -->
        <select v-if="symbols" class="pro-select" v-model="symbol1" size="small">
          <option v-for="(item, key) in symbols" :key="key" :value="item.symbol" :label="labelCoin(item)"></option>
        </select>
      </el-col>
      <el-col :span="4">
        <span class="vs">VS</span>
      </el-col>
      <el-col :span="10">
        <!-- <el-select v-if="symbols" v-model="symbol2" @visible-change="onChangeCoin" size="small">
          <el-option v-for="(item, key) in symbols" :key="key" :value="item.symbol" :label="labelCoin2(item)"></el-option>
        </el-select> -->
        <select v-if="symbols" class="pro-select" v-model="symbol2" size="small">
          <option v-for="(item, key) in symbols" :key="key" :value="item.symbol" :label="labelCoin(item)"></option>
        </select>
      </el-col>
    </div>

    <div class="chart_cycle_bx">
      <el-radio-group v-model="cycleType" size="small">
        <el-radio-button label="1h"></el-radio-button>
        <el-radio-button label="24h"></el-radio-button>
        <el-radio-button label="7d"></el-radio-button>
        <el-radio-button label="30d"></el-radio-button>
        <el-radio-button label="90d"></el-radio-button>
        <el-radio-button label="1y"></el-radio-button>
        <el-radio-button label="all"></el-radio-button>
      </el-radio-group>
    </div>

    <div class="chart_cont_bx" ref="chart">
      <compare-chart v-if="offset" :symbol1="symbol1" :symbol2="symbol2" :offset="offset" :cycleType="cycleType" chartDivName="Compare"></compare-chart>
    </div>
    <div class="compare_footer">
      <compare-coin v-if="symbol1!=''&&symbol2!=''" :symbol1="symbol1" :symbol2="symbol2"></compare-coin>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  components: {
    CompareChart: () => import(/* webpackPrefetch: true */ '@/components/view/common/compareChart'),
    CompareCoin: () => import(/* webpackPrefetch: true */ '@/components/view/sise/compareCoin')
  },
  data() {
    return {
      symbol1: '',
      symbol2: '',

      cycleType: '24h',

      offset: null,
    };
  },
  computed: {
    ...mapGetters([ 'isMaster', 'symbols' ]),
  },
  methods: {
    labelCoin(item) {
      return item.coincd+item.currency+' ('+item.vexidnm+')'
      // if (item.exidnm == 'OKEX') {
      //   return item.coincd+item.currency+' ('+item.exidnm.substr(0,2)+')'
      // } else if (item.exidnm.indexOf('Cryptocurrency') >= 0) {
      //   return item.coincd+item.currency+' ('+item.exidnm.substr(0,2)+')'
      // } else {
      //   return item.coincd+item.currency+' ('+item.exidnm.substr(0,1)+')'
      // }
    },
    initCompare() {
      const self = this;
      self.symbol1 = Object.keys(self.symbols)[0];
      self.symbol2 = Object.keys(self.symbols)[1];

      self.$nextTick(() => {
        self.offset = {
          left: self.$refs.chart.offsetLeft+10,
          top: self.$refs.chart.offsetTop+55,
          width: self.$refs.chart.offsetWidth-20,
          height: self.$refs.chart.offsetHeight
        }
      });
    }
  },
  mounted() {
    const self = this;
    if (self.isMaster) {
      self.initCompare();
    }
    self.$EventBus.$on("loadMaster", self.initCompare);
  },
  beforeDestroy() {
    const self = this;
    self.$EventBus.$off("loadMaster", self.initCompare);
  }
}
</script>

<style lang="scss" scoped>
/*.content .chart_top_bx {
  height: 40px;
  line-height: 40px;
  text-align: center;
}*/

.content .chart_cycle_bx {
  height: 40px;
  line-height: 40px;
  text-align: center;
}

.content .chart_cont_bx {
  flex:1;
  //height: calc(100% - 200px);
}

.content .compare_footer {
  height: 50px;
}
</style>
