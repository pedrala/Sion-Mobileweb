<template>
  <div>
    <div align="right">
      <el-row>
        <ul style="font-size: 11px;border-right: 5px solid #ffffff;">
          <li v-if="yieldData && yieldData.length > 0">
            last updated  : {{ yieldData[yieldData.length - 1].date | dateFormat3 }}
          </li>
           <!-- <li v-else>
            <p  style="font-size: 15px;color:red">데이터가 없습니다.</p>
          </li> -->
        </ul>
      </el-row>
    </div>
    <div class="chart">
      <SpecialPerformance :chartData="profitHistoryChartData"></SpecialPerformance>
    </div>
  </div>
</template>

<script>
import SpecialPerformance from "./SpecialPerformance.vue";
import moment from "moment";

export default {
  /**
   * @property {object} expert props 로 받은 전문가 상세 데이터
   */
  props: ["yieldData", "gb"],
  components: {
    SpecialPerformance
  },
  computed: {
    /**
     * 실적 탭 차트에 바인딩 하는 실적 데이터(self.profitHistory)를 변환한 데이터
     * @returns {object} 차트 데이터
     */
    profitHistoryChartData() {
      let self = this;
      moment.locale(self.$i18n.locale);
      let res = self.yieldData; //self.yieldData.reverse();
      return {
            
          dates: res.map(item => item.date),
          labels: res.map(item => moment(item.date, "YYYYMMDD").format("MM/DD")),
          datasets: [
            {
              label: "수익률",//"수익률(라인)",
              borderColor: "#4fd165",
              data: (self.gb == '0')? res.map(item => item.data) : res.map(item => item.profits),  //gb 0:가능한 전략  gb 1:운용중 전략
              type: "line",
              yAxisID: 'leftchart'
            }       
          ]          
      }     
    }
  },
};
</script>
