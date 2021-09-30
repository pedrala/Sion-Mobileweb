<template >
 <div  class="content" style="font-weight:bold;text-align:center;overflow:auto">

    <div class="chart_top_bx sise-header">
      <el-col :span="10">
        <el-select v-show="symbols" v-model="symbol1" size="small">
          <el-option v-for="(item, key) in symbols" :key="key" :value="item.symbol" :label="labelCoin(item)"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4"><span class="vs">VS</span></el-col>
      <el-col :span="10">
        <el-select v-show="symbols" v-model="symbol2" size="small">
          <el-option v-for="(item, key) in symbols" :key="key" :value="item.symbol" :label="labelCoin(item)"></el-option>
        </el-select>
      </el-col>
    </div>

    <diagnosisUp v-if="symbol1!=''" :symbol="symbol1"></diagnosisUp>
    <diagnosisDown v-if="symbol2!=''" :symbol="symbol2"></diagnosisDown>
 </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
   components: {
    diagnosisUp: () => import(/* webpackPrefetch: true */ '@/components/view/sise/diag/diagnosisUp'),
    diagnosisDown: () => import(/* webpackPrefetch: true */ '@/components/view/sise/diag/diagnosisDown'),
  },
  data() {
    return {
      symbol1: '',
      symbol2: ''
    };
  },
  computed: {
    ...mapGetters([ 'isMaster', 'symbols' ])
  },
  methods: {
    labelCoin(item) {
      return item.coincd+item.currency+' ('+item.vexidnm+')'
    },
    initCompare() {
      const self = this;
      self.symbol1 = Object.keys(self.symbols)[0];
      self.symbol2 = Object.keys(self.symbols)[1];
    }
  },
  mounted() {
    const self = this;
    if(self.isMaster) {
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
