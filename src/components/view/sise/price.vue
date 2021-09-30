<template>
  <div class="content" style="overflow:hidden;">
    <div class="board-content-body pt0 pb0" style="padding-bottom:0; overflow:hidden;">
      <display :symbol="symbol"></display>
      <div style="height: 285px;">
        <app-graph :symbol="symbol"></app-graph>
      </div>
      <div class="product-info-tab" style="padding:0;flex:1; overflow:hidden;">
        <!-- <md-tabs md-alignment="fixed" class="md-tab-sm" style="height:100%;">
          <md-tab md-label="진단">
            <diag-data :symbol="symbol"></diag-data>
          </md-tab>
          <md-tab md-label="상품개요">
            <product-summary :coincd="coincd"></product-summary>
          </md-tab>
          <md-tab md-label="관련뉴스">
            <news-table :coincd="coincd"></news-table>
          </md-tab>
        </md-tabs> -->
        <el-tabs  v-model="activeName" stretch style="height:100%;" >
          <el-tab-pane label="진단" name="diag">
            <diag-data  :symbol="symbol"></diag-data>
          </el-tab-pane>
          <el-tab-pane label="상품개요" name="product" lazy>
            <product-summary  :coincd="coincd"></product-summary>
          </el-tab-pane>
          <el-tab-pane label="관련뉴스" name="news" lazy>
            <news-table :coincd="coincd"></news-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
	</div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  components: {
    Display: () => import(/* webpackPrefetch: true */ '@/components/view/sise/display'),
    AppGraph: () => import(/* webpackPrefetch: true */ '@/components/view/sise/appGraph'),
    DiagData: () => import(/* webpackPrefetch: true */'@/components/view/sise/priceTab/diag'),
    ProductSummary: () => import(/* webpackPrefetch: true */ '@/components/view/sise/priceTab/product'),
    NewsTable: () => import(/* webpackPrefetch: true */ '@/components/view/sise/priceTab/news'),
  },
  computed: {
    ...mapGetters([ 'isMaster', 'symbols' ]),
  },
  data() {
    return {
      symbol: '',
      coincd: '',
      activeName: 'diag'
    };
  },
  methods: {
    getData() {
      const self = this;
      self.$EventBus.$emit("setLogo", {
        type: "",
        text:  "| " + self.symbols[self.symbol].vexidnm + ' : ' + self.symbols[self.symbol].coincd + self.symbols[self.symbol].currency + " |",
        showTitle: true
      });
    }
  },
  created() {
    const self = this;
    if (self.$route.query.symbol) {
      self.symbol = self.$route.query.symbol;
      self.coincd = self.$route.query.coincd;
    }
    self.$EventBus.$emit("setMenuIndex", "1");

    // 세로모드 고정
    if (typeof cordova !== 'undefined') {
      cordova.exec( null , null, "AppPlugin" , "setOrientation", [ AppManager.SCREEN_ORIENTATION_PORTRAIT ]);
    }
  },
  beforeCreate() {
    console.log("price beforeCreate");
  },
  beforeMount() {
    console.log("price beforeMount");    
  },
  mounted() {
    console.log("price mounted");
    const self = this;
    if (self.isMaster) {
      self.getData();
    }
    self.$EventBus.$on("loadMaster", self.getData);
  },
  beforeDestroy() {
    const self = this;
    self.$EventBus.$off("loadMaster", self.getData);
  }
}
</script>

<style lang="scss" scoped>
.content.horizontal {
  padding-bottom: 0px !important;
}
</style>
