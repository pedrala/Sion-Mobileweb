<template>
  <div class="sion-score">
    <h3>
      SiON Score
      <el-button @click="goGuide" size=mini class="guide-btn">
        <i class="el-icon-info"></i>
      </el-button>
    </h3>

    <div class="sion-score-header">
      <el-radio-group v-model="timeUnit" @change="timeUnitChange" size="mini">
        <el-radio-button label="1"> 분</el-radio-button>
        <el-radio-button label="2"> 일</el-radio-button>
        <el-radio-button label="3" v-bind:class="{'disabled' : !isLoggedIn}"> 주</el-radio-button>
        <el-radio-button label="4" v-bind:class="{'disabled' : !isLoggedIn}"> 월</el-radio-button>
        <!-- <el-radio-button label="5" v-bind:class="{'disabled' : !isLoggedIn}"> 종합</el-radio-button> -->
      </el-radio-group>
    </div>
    <div class="no-data" v-if="visibleScore"> <!-- 해당 자료가 없습니다.--></div>
    <div class="chart-area" v-else>
      <gauge-chart :chart-data="datacollection" :options="options"></gauge-chart>
    </div>

  <el-dialog :visible.sync="visibleGuide" class="mob modal modal-turms score-guide"
    :show-close="true"
    width="100%"
    center
    top="0"
    :close-on-click-modal="true"
    append-to-body>
      <template slot="title">
        <div>
          <span class="el-dialog__title"><b>SiON Score</b></span>
        </div>
      </template>
      <div class="section">
          한국금융IT의 멀티 분석용 차트인 <span class="blue">K-Chart,
          Signal Maker </span>솔루션 활용하여 점수화 제공
        <br>
        <br>
          상품, 종목의 가격 변동 움직임을 통계적 기법을 적용하여 주기와 추세, 패턴, 지지와 저항 등으로 분해, 분석하여 산출
        <br>
        <br>
        가격의 추세, 변동성, 모멘텀 지표 활용
        <ul>
          <li>- 추세지표: MACD, TRIX, PSAR 등</li>
          <li>- 변동성지표: BWI, Sigma 등</li>
          <li>- 모멘텀지표: RSI, Williams’R 등</li>
          <li>- 기타: Bollinger Bands, Envelope 등</li>
        </ul>
      </div>

      <div class="section msg-warning">
          <span class="accent">※ 이 지수는 투자조언이 절대 아닙니다.</span>
          시장 상황에 대한 이해를 돕고자 가격 데이터를
          여러 기술적 지표 등을 적용, 분석화하여 시각화,
          점수화 한 것입니다.
      </div>

      <div slot="footer">
        <el-button @click="guideClose" class="button button-bg03 block">{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>

    <el-dialog class="mob modal modal-turms score-guide"
               title="도움말"
               :visible.sync="visibleLogin"
               :show-close="true"
               width="100%" center style="margin:220px 40px;overflow:hidden;"
               top="0px"
               :close-on-click-modal="true" append-to-body>
      <div class="section" style="padding-bottom: 10px;font-size:12px">
        <ul>
          <li> - 로그인 후에 보실 수 있습니다.   </li>
          <li> - 회원이 아니시면 회원가입 부탁드립니다.    </li>
        </ul>
      </div>

      <div slot="footer" >
        <el-button-group  style="width:100%">
          <el-button @click="goLogin" type="primary" size="small" plain style="width:50%;">회원가입 바로가기 </el-button>
          <el-button @click="visibleLogin = false" type="primary" size="small" style="width:50%;">{{ $t("common.confirm") }}</el-button>
        </el-button-group>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  components: {
    GaugeChart: () => import(/* webpackPrefetch: true */ '@/components/view/sise/diag/GaugeChart.js'),
  },
  computed: {
    ...mapGetters([ 'isLoggedIn' ])
  },
  props: [ 'symbol', 'direction'],
  watch : {
    symbol() {
      const self = this;
      self.score = '';
      self.getSionScore();
    },
    visibleLogin() {
      const self = this;
      if (self.visibleLogin) {
        self.$EventBus.$emit('downChart');
      } else {
        self.$EventBus.$emit('upChart');
      }
    },
    visibleGuide() {
      const self = this;
      if (self.visibleGuide) {
        self.$EventBus.$emit('downChart');
      } else {
        self.$EventBus.$emit('upChart');
      }
    }
  },
  data() {
    return {
      datacollection: {
        datasets: [{
          labels: ['침체', '저조', '중립', '주의', '과열'],
          data: [100, 80, 60, 40, 20],
          value: 50,
          backgroundColor: ['#5a8ac6', '#9ab7dc', '#dbe5f3', '#fbccce', '#f8696b'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        title: {
          display: false
        },
        animation: {
          duration: 0 // general animation time
        },
        hover: {
          animationDuration: 0 // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
        layout: {
          padding: {
            left:15,
            right:15,
            top:0,
            bottom: 0
          },
          margin: {
            top: 0
          }
        },
        // rotation: .75 * Math.PI, // 배경 Doughnut Chart rotation
        // circumference: 1.5 * Math.PI, // 배경 Doughnut Chart Circle range
        cutoutPercentage: 40,
        needle: {
          radiusPercentage: 2,
          widthPercentage: 3.2,
          lengthPercentage: 100,
          color: '#666666'
        },
        valueLabel: {
          display: true,
          formatter: (value) => {
            return Math.round(value) + '점';
          },
          fontSize: 14,
          backgroundColor: '#FFF',
          color: '#666',
          bottomMarginPercentage: -8,
          padding: {
            top: 2
          }
        },
        plugins: {
          datalabels: {
            display: 'auto',
            formatter:  function (value, context) {
              return context.dataset.labels[context.dataIndex];
            },
            color: 'rgba(0, 0, 0, 1.0)',
            anchor: 'end',
            align: 'end',
            offset:  (value) => {
              const rotate = [-5, -10, 0 , -10, -5];
              return rotate[value.dataIndex];
            },
            rotation: (value) => {
              const rotate = [-75, -40, 0 , 40, 75];
              return rotate[value.dataIndex];
            },
            backgroundColor: null,
            font: {
              size: 10,
              weight: 'bold'
            }
          }
        }
      },
      timeUnit:2, //기본 일봉 기준
      visibleScore: true,
      visibleGuide: false,
      visibleLogin: false,
      score: ''
    };
  },
  methods: {
    //시온스코어 가이드
    displayLogin() {
      const self = this;
      console.log(self.isLoggedIn);
      console.log(self.timeUnit);
      if(!self.isLoggedIn && [1, 2].indexOf(self.timeUnit) === -1) {
        // Login Popup
        self.timeUnit = 2;
        self.visibleLogin = true;
      }
    },
    goLogin(){
      const self = this;
      self.visibleLogin = false;
      self.$store.commit("setNeedLogin", true);
      self.$store.commit("setLoginCallbackUrl", 'diagnosis');
    },
    goGuide() {
      const self = this;
      setTimeout(function() {
        self.$EventBus.$emit('downChart');
        self.visibleGuide = true;
			}, 100)
    },
    guideClose() {
      const self = this;
      setTimeout(function() {
        self.$EventBus.$emit('upChart');
        self.visibleGuide = false
      }, 100)
    },
    timeUnitChange() {
      const self = this;
      if(!self.isLoggedIn && self.timeUnit > 2) {
        self.visibleLogin = true;
        self.timeUnit = 2;
        return;
      }
      self.getSionScore();
      self.$EventBus.$emit('sendTime', {time: self.timeUnit, direction:self.direction});
    },
    //시온스코어 조회
    getSionScore() {
      const self = this;
      let header = { trName: 'at338' }
      let input = {
        InBlock1: [{
          gubun	: self.timeUnit, //1:1분, 2:일, 3:주, 4:월, 5:종합
          symbol: self.symbol
        }]
      }
      //console.log("at338_input", JSON.stringify(input));
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("getSionScore", queryData);
        if (queryData != null) {
          if (queryData.queryObj) {
            let output = queryData.queryObj.OutBlock1[0];
            if (output != null) {
              if (output.rslt_cls == '1') {
                if( output.score != '') {
                  self.score = output.score;
                  self.datacollection =  {
                    datasets: [{
                      labels: ['침체', '저조', '중립', '주의', '과열'],
                      data: [100, 80, 60, 40, 20],
                      value: output.score === 'N.A' ? 0 : Number(output.score),
                      backgroundColor: ['#5a8ac6', '#9ab7dc', '#dbe5f3', '#fbccce', '#f8696b'],
                      borderWidth: 2
                    }]
                  }; // .datasets[0].value = Number(output.score);
                  self.visibleScore = false
                } else {
                  self.datacollection = {
                    datasets: [{
                      labels: ['침체', '저조', '중립', '주의', '과열'],
                      data: [100, 80, 60, 40, 20],
                      value: 0,
                      backgroundColor: ['#5a8ac6', '#9ab7dc', '#dbe5f3', '#fbccce', '#f8696b'],
                      borderWidth: 2
                    }]
                  }; // .datasets[0].value = 0;
                  self.visibleScore = true
                }
              } else {
                let rslt_msg = output.rslt_msg;
                self.$alert(rslt_msg, '', {
                  confirmButtonText: self.$t("common.confirm")
                });
              }
            }
          } else {
            self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
              confirmButtonText: self.$t("common.confirm"),
            });
          }
        }
      });
    },
  },
  mounted() {
    const self = this;
    self.getSionScore();
  },
}
</script>

<style lang="scss">
.mob.modal .el-dialog .el-dialog__body {
  padding: 0;
  height: calc(100% - 55px);
  background-color: #fff;
}

.el-dialog__footer {
    padding: 0;
}
.el-radio-button--mini .el-radio-button__inner {
  padding:3.5px 7px;
  font-size: 10px;
}
/* Chart */
.chart-area {
  flex:1;
  padding: 0 10px;
  text-align:center;
  display:flex;
  justify-content: center;
  align-items: center;
  .chartjs-render-monitor {
    margin-top: -25px;
  }
  /*height:100px;*/
  /*canvas {
    margin-top: -15px;
  }*/

  .chart-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);

  }
}
</style>
