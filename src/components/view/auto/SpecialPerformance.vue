<script>
import { Bar, mixins  } from "vue-chartjs";
const { reactiveProp } = mixins
import MobileDetect from "mobile-detect";
// import ChartRounded from "../../library/Chart.roundedBarCharts.min.js";

export default {
  extends: Bar,
  mixins: [reactiveProp],  //데이터 바뀔시 챠트 자동 업데이트
  props: ["chartData"],
  data() {
    return {
      options: {
        cornerRadius: 30,
        tooltips: {
          backgroundColor: "rgba(0,0,0,0.6)",
          intersect : false, //마우스 커서가 차트 어느 영역에 있든지 툴팁 표시하기, (true:차트 요소를 선택했을 경우에만 표시)
          callbacks: {
            label: function(tooltipItem, data) {
              var label = data.datasets[tooltipItem.datasetIndex].label || "";
              if (label) {
                label += ": ";
              }
              label += Math.round(tooltipItem.yLabel * 100) / 100 + "%";
              return label;
            }
          }
        },
        elements: {
          line: {
            tension: 0,
            borderWidth: 2,
            backgroundColor: "transparent",
            borderColor: "#4fd165"
          },
          // point: {
          //   radius: 0,
          //   borderWidth: 1,
          //   backgroundColor: "#fff",
          //   borderColor: "#4fd165"
          // }
        },
        scales: {
          //X축
          xAxes: [
            {
              ticks: {
                fontSize: 8,
                // autoSkip: true,
                // autoSkipPadding: 0,
              },
              // barPercentage: 0.15,
              // categoryPercentage: 0.5,
              barThickness: 3,
              gridLines: {
                display: false
              }
            }
          ],
          //Y축
          yAxes: [
            {
              id: "leftchart",
              display: true,
              scaleLabel: {
                display: false,
                labelString: ''//'수익률'
              },
              ticks: {
                fontSize: 8,
                callback: function(value, index, values) {                
                  return 	value + "%";
                }
              },
              gridLines: {
                display: true,
                lineWidth: 1,
                // borderDash: [1, 3],
                color: "#f0f2f7",
                zeroLineWidth: 0.5
              }
            },
         
          ]
        },
        legend: {
          display: false,
          position: 'top',
          fullWidth: true,
          labels: {
              // fontColor: 'rgb(255, 99, 132)',
              boxWidth : 12
          }
        },
        animation: {
          animateScale: true
        },
        // title: {
        //   display: true,
        //   text: "test"
        // },
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  methods: {
    createChart(chartData) {
      const self = this;
      var chart = document.getElementById("bar-chart");
      var myHorizBarChart = new Chart(chart, {
          type: 'bar',
          data: chartData,
          options: self.options
      });

      chart.style.width = "100%";     
      /* chart 높이 설정 */    
      chart.style.height = "180px";     
    },
  },
  created() {
  
  },
  mounted() {
    console.log("chartData mounted");
    let self = this;
    self.renderChart(this.chartData, this.options);

    //차트초기화
    self.createChart([]);

    //차트로딩 및 에니메이션효과
    setTimeout(function() {
      self.createChart(self.chartData);
    }, 1000);
  },
};
</script>
