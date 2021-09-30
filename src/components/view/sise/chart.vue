<template>
  <div style="text-align:center;background-color: #fff;height: 100%">
    <app-graph :symbol="symbol"></app-graph>
	</div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  components: {
    AppGraph: () => import(/* webpackPrefetch: true */ '@/components/view/sise/appGraph'),   
  },
  computed: {
    ...mapGetters([ 'isMaster', 'symbols' ]),
  },
  data() {
    return {
      symbol: '',
    };
  },
  methods: {
    getData() {
      const self = this;
      self.$EventBus.$emit("setLogo", {
        type: "",
        text:  "| " + self.symbols[self.symbol].vexidnm + ' : ' + self.symbols[self.symbol].coincd + " |"
      });
    },
    // setOffset() {
    //   const self = this;
    //   self.offset = {
    //     left: self.$refs.chart.offsetLeft,
    //     top: self.$refs.chart.offsetTop+25,
    //     width: self.$refs.chart.offsetWidth,
    //     height: self.$refs.chart.offsetHeight
    //   }
    // },
  },
  created() {
    const self = this;
    if (self.$route.query.symbol) {
      self.symbol = self.$route.query.symbol;
    }
    self.$EventBus.$emit("setMenuIndex", "1");

    // 가로모드
    if (typeof cordova !== 'undefined') {
      cordova.exec( null , null, "AppPlugin" , "setOrientation", [ AppManager.SCREEN_ORIENTATION_SENSOR_LANDSCAPE ]);
    }
    self.$store.commit("setVertical", false);
    
  },
  mounted() {
    const self = this;
    // self.$nextTick(() => {
    //   self.setOffset();
    // });
    if (self.isMaster) {
      self.getData();
    }
    self.$EventBus.$on("loadMaster", self.getData);
  },
  beforeDestroy() {
    const self = this;
    self.$EventBus.$off("loadMaster", self.getData);

    // 세로모드
    self.$store.commit("setVertical", true);
    if (typeof cordova !== 'undefined') {
      cordova.exec( null , null, "AppPlugin" , "setOrientation", [ AppManager.SCREEN_ORIENTATION_PORTRAIT ]);
    }
  }
}
</script>
