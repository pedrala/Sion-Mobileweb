<template>
  <div class="chart_cont">
    <div class="chart_top_bx tx-cn">
      <!-- <select name="pets" id="pet-select">
        <option value="">--Please choose an option--</option>
        <option value="dog">Dog</option>
        <option value="cat">Cat</option>
        <option value="hamster">Hamster</option>
        <option value="parrot">Parrot</option>
        <option value="spider">Spider</option>
        <option value="goldfish">Goldfish</option>
      </select> -->
      <el-button-group>
        <el-button class="btn_data" size="small" v-bind:class="{ active: isDataList }" @click="showDataList"></el-button>
        <el-button class="btn_top_setting" size="small" @click="showModalSetting"></el-button>
        <el-button class="btn_assay_tool" size="small" @click="showToolBar" ></el-button>
      </el-button-group>
      <select v-model="cycunit" class="pro-select" @change="onChangeCycUnit" @visible-change="visibleChange">
        <option value="" disabled selected>분</option>
        <option label="1분" value="1"></option>
        <option label="3분" value="3"></option>
        <option label="5분" value="5"></option>
        <option label="10분" value="10"></option>
        <option label="15분" value="15"></option>
        <option label="30분" value="30"></option>
        <option label="60분" value="60"></option>
      </select>
      <!-- <el-select v-model="cycunit" placeholder="분" size="small" style="width:70px;z-index:10;" @change="onChangeCycUnit" @visible-change="visibleChange">
        <el-option label="1분" value="1"></el-option>
        <el-option label="3분" value="3"></el-option>
        <el-option label="5분" value="5"></el-option>
        <el-option label="10분" value="10"></el-option>
        <el-option label="15분" value="15"></el-option>
        <el-option label="30분" value="30"></el-option>
        <el-option label="60분" value="60"></el-option>
      </el-select> -->
      <select v-model="cyc" class="pro-select" @change="onChangeCyc" @visible-change="visibleChange">
        <option value="" disabled selected>일</option>
        <option label="일" value="2"></option>
        <option label="주" value="3"></option>
        <option label="월" value="4"></option>
      </select>
      <!-- <el-select v-model="cyc" placeholder="일" size="small" style="width:70px;z-index:10;" @change="onChangeCyc" @visible-change="visibleChange">
        <el-option label="일" value="2"></el-option>
        <el-option label="주" value="3"></el-option>
        <el-option label="월" value="4"></el-option>
      </el-select> -->
      <el-button v-if="isVertical" size="small" @click="showChart">가로모드</el-button>
    </div>

    <div ref="chart" class="chart_cont_bx">
      <app-chart v-if="offset" :symbol="symbol" :offset="offset" chartDivName="Sise"></app-chart>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
	components: {
    AppChart: () => import(/* webpackPrefetch: true */ '@/components/view/common/appChart'),
	},
	props: ['symbol'],
  data() {
    return {
      cyc: '2',
      cycunit: '',

      isDataList: false,

      offset: null,
    }
  },
  computed: {
    ...mapGetters([ 'isVertical' ]),
  },
  methods: {
    showChart() {
      //가로모드 고정
      if (typeof cordova !== 'undefined') {
        cordova.exec( null , null, "AppPlugin" , "setOrientation", [ AppManager.SCREEN_ORIENTATION_SENSOR_LANDSCAPE ]);
      }

      const self = this;
      self.$router.push({
        path: '/sise/chart',
        query: {
          symbol: self.symbol
        }
      });
    },
  	showDataList() {
      const self = this;
      self.isDataList = !self.isDataList;
      self.$EventBus.$emit('showDataList', self.isDataList)
		},
    showModalSetting() {
      const self = this;
      self.$EventBus.$emit('showModalSetting', self.isDataList)
		},
    showToolBar() {
      const self = this;
      self.$EventBus.$emit('showToolBar', self.isDataList)
    },
    visibleChange(val) {
      const self = this;
      // if (val) {
      //   self.$EventBus.$emit("downChart");
      // } else {
      //   self.$EventBus.$emit("upChart");
      // }
    },
    onChangeCycUnit() {
      const self = this;
      self.cyc = '';
      let param = {
        cyc: '1',
        cycunit: self.cycunit,
      }
      self.$EventBus.$emit("changeCyc", param);
    },
    onChangeCyc() {
      const self = this;
      self.cycunit = '';
      let param = {
        cyc: self.cyc,
        cycunit: '',
      }
      self.$EventBus.$emit("changeCyc", param);
    },
    setOffset() {
      const self = this;
      var topMargin = 65;
      console.log("setOffset:"+self.isVertical);
      if(!self.isVertical) {
          topMargin = 5;
      }
      self.offset = {
        left: self.$refs.chart.offsetLeft,
        top: self.$refs.chart.offsetTop+topMargin,
        width: self.$refs.chart.offsetWidth,
        height: self.$refs.chart.offsetHeight
      }
    },
  },
  created() {

  },
  beforeMount() {
    // 세로모드
    // const self = this;
    // self.$store.commit("setVertical", true);
  },
  mounted() {
    const self = this;
    console.log("mounted:"+self.isVertical);
    setTimeout(() => {
      self.setOffset();
    }, 0);
  },
  beforeDestroy() {
  }
}
</script>

<style lang="scss" scoped>
.chart_cont {
  width: 100%;
  height: 100%;

  .chart_top_bx {
    height: 35px;
  }

  .chart_cont_bx {
    border: 1px solid #000;
    flex:1;
    height: calc(100% - 35px) !important;
  }

  .el-input__inner {
    text-align: center;
    padding-right: 15px;
  }
  .el-input__suffix {
    display: none;
  }

  li.el-select-dropdown__item {
    padding: 0 10px;
  }

  .btn_data {
    background: url("../../../images/chart/m_chart_btm_data.png") no-repeat center;
    background-size: 18px;
    width: 35px;
    height: 32px;
  }
  .btn_data.active {
    background: url("../../../images/chart/m_chart_btm_data_on.png") no-repeat center;
    background-size: 18px;
    background-color: #e3e7ff;
    border: 1px solid #3f51b5;
  }
  .btn_top_setting {
    background: url("../../../images/chart/m_chart_btn_setting.png") no-repeat center;
    background-size: 20px;
    width: 35px;
    height: 32px;
  }
  .btn_assay_tool {
    background: url("../../../images/chart/m_chart_btn_assay.png") no-repeat center;
    background-size: 18px;
    width: 35px;
    height: 32px;
  }
}
.chart_cont.horizontal {
  height: 100%;
}
</style>
