<template>
  <div class="sion-score" style="display: flex; flex-direction: column;">
    <h3>종합국면진단<el-button @click="goGuide" size=mini class="guide-btn"><i class="el-icon-info"></i></el-button></h3>

    <div v-if="visibleData" style="flex:1;"><!-- 해당 자료가 없습니다.--></div>

    <div v-else style="flex:1; padding:8px 0;">
      <table class="heatmap-chart-table">
        <colgroup>
          <col width="60"/>
          <col />
          <col />
          <col />
          <col />
          <col />
        </colgroup>
        <thead>
          <tr class="thead">
            <th><i class="el-icon-info" @click="goGuideDirection"></i>방향</th>
            <th colspan="5">
              <div class="tb-header">
                <div class="tb-header-item">침체</div>
                <div>~</div>
                <div class="tb-header-item">중립</div>
                <div>~</div>
                <div class="tb-header-item">과열</div>
              </div>
            </th>
<!--            <th>침체</th>
            <th>저조</th>
            <th>중립</th>
            <th>주의</th>
            <th>과열</th>-->
          </tr>
        </thead>
        <tbody>
          <tr :class="'color-' + (isLoggedIn ? phaseDiagData.s_color : '0')">
            <th :class="'slope-' + (isLoggedIn ? phaseDiagData.s_slope : '0')">
              <span>단기</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="9" viewBox="0 7.469 24 9">
                <path fill="none" d="M0,0h24v24H0V0z"/>
                <path class="arrow" d="M15.938,11H0.969v2h14.969v3l7.484-4l-7.484-4V11z"/>
              </svg>
            </th>
            <td><div></div></td>
            <td><div></div></td>
            <td><div></div></td>
            <td><div></div></td>
            <td><div></div></td>
          </tr>
          <tr :class="'color-' + (isLoggedIn ? phaseDiagData.m_color : '0')">
            <th :class="'slope-' + (isLoggedIn ? phaseDiagData.m_slope : '0')">
              <span>중기</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="9" viewBox="0 7.469 24 9">
                <path fill="none" d="M0,0h24v24H0V0z"/>
                <path class="arrow" d="M15.938,11H0.969v2h14.969v3l7.484-4l-7.484-4V11z"/>
              </svg>
            </th>
            <td><div></div></td>
            <td><div></div></td>
            <td><div></div></td>
            <td><div></div></td>
            <td><div></div></td>
          </tr>
          <tr :class="'color-' + (isLoggedIn ? phaseDiagData.l_color : '0')">
            <th :class="'slope-' + (isLoggedIn ? phaseDiagData.l_slope : '0')">
              <span>장기</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="9" viewBox="0 7.469 24 9">
                <path fill="none" d="M0,0h24v24H0V0z"/>
                <path class="arrow" d="M15.938,11H0.969v2h14.969v3l7.484-4l-7.484-4V11z"/>
              </svg>
            </th>
            <td><div></div></td>
            <td><div></div></td>
            <td><div></div></td>
            <td><div></div></td>
            <td><div></div></td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="tfoot" :class="'color-' + (isLoggedIn ? phaseDiagData.t_color : '0')">
            <th :class="'slope-' + (isLoggedIn ? phaseDiagData.t_slope : '0')">
              <span>종합</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="9" viewBox="0 7.469 24 9">
                <path fill="none" d="M0,0h24v24H0V0z"/>
                <path class="arrow" d="M15.938,11H0.969v2h14.969v3l7.484-4l-7.484-4V11z"/>
              </svg>
            </th>
            <td><div></div></td>
            <td><div></div></td>
            <td><div></div></td>
            <td><div></div></td>
            <td><div></div></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- 종합국면진단 도움말 -->
    <el-dialog :visible.sync="visibleGuide" class="mob modal modal-turms score-guide" width="100%" top="0px" append-to-body>
      <template slot="title">
        <div>
          <span class="el-dialog__title"><b>종합국면진단</b></span>
        </div>
      </template>
      <div class="section">
        한국금융IT의 멀티 분석용 차트인 <span class="blue">K-Chart,Signal Maker </span>솔루션 활용하여 점수화 제공<br><br>
        경기를 예측하는 시기에 따라 단기, 중기, 장기로 구분, 단기는 1~3개월, 중기는 1년, 장기는 5년 정도가 일반적이나, 가상자산의 경우 시계열 데이터 부족하여 일부만 산정<br><br>
        가격의 추세, 변동성, 모멘텀 지표 활용
        <ul>
          <li>- 추세지표: MACD, TRIX, PSAR 등   </li>
          <li>- 변동성지표: BWI, Sigma 등    </li>
          <li>- 모멘텀지표: RSI, Williams’R 등    </li>
          <li>- 기타: Bollinger Bands, Envelope 등   </li>
        </ul>
      </div>

      <div class="section msg-warning">
        <span class="accent">이 지수는 투자조언이 절대 아닙니다.</span>
        시장 상황에 대한 이해를 돕고자 가격 데이터를
        여러 기술적 지표 등을 적용, 분석화하여 시각화,
        점수화 한 것입니다.
      </div>

      <div slot="footer" >
        <el-button @click="guideClose" class="button button-bg03 block" >{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>

    <!-- 방향 도움말 -->
    <el-dialog class="mob modal modal-turms" :visible.sync="visibleDirectionGuide" width="100%" style="margin:170px 40px;overflow:hidden;" top="0px" append-to-body>
      <template slot="title" >
        <div style="text-align:center">
          <span class="el-dialog__title"><b>도움말</b></span>
        </div>
      </template>

      <div class="section" style="padding-bottom: 10px;font-size:12px">
        주가방향: 최근 주가 추세(방향)를 나타냄<br>
        상   승
        <div class="slope-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="9" viewBox="0 7.469 24 9">
            <path fill="none" d="M0,0h24v24H0V0z"/>
            <path class="arrow" d="M15.938,11H0.969v2h14.969v3l7.484-4l-7.484-4V11z"/>
          </svg>
        </div>
        <br>
        강 보합<br>
        횡   보<br>
        약 보합<br>
        하   락
      </div>
      <div slot="footer" >
        <el-button @click="directionGuideClose" style="border-radius: 0; height: 55px; line-height: 55px;" class="button button-bg03 block" >{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>

    <div class="infoi login-msg" :style="{ display: isLoggedIn?'none':'flex' }">
      <el-button type="primary" @click="goLogin">로그인</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props:[ 'symbol' ],
  computed: {
    ...mapGetters([ 'isLoggedIn' ])
  },
  watch : {
    symbol() {
      const self = this;
      self.getPhaseDiag();
    }
  },
  data() {
    return {
      visibleGuide: false,
      visibleDirectionGuide: false,
      visibleData: true,
      phaseDiagData: {},
    };
  },
  methods: {
    goGuide(){
      const self = this;
      setTimeout(function() {
        self.visibleGuide = true;
        //self.$EventBus.$emit('downChart');
			}, 100)
    },
    guideClose() {
      const self = this;
      setTimeout(function() {
        self.visibleGuide = false;
        //self.$EventBus.$emit('upChart');
      }, 100)
    },
    goGuideDirection(){
      const self = this;
      setTimeout(function() {
        self.visibleDirectionGuide = true;
        //self.$EventBus.$emit('downChart');
			}, 100)
    },
    directionGuideClose() {
      const self = this;
      setTimeout(function() {
        self.visibleDirectionGuide = false;
        //self.$EventBus.$emit('upChart');
      }, 100)
    },
    goLogin(){
      const self = this;
      self.visibleGuide = false
      self.$store.commit("setNeedLogin", true);
      self.$store.commit("setLoginCallbackUrl", 'diagnosis');
    },
    getPhaseDiag() {
      const self = this;
      let header = { trName: 'at339' }
      let input = {
        InBlock1: [{
          symbol: self.symbol
        }]
      }

      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("getPhaseDiag", queryData);
        if (queryData != null) {
          if (queryData.queryObj) {
            let output = queryData.queryObj.OutBlock1[0];
            if (output != null) {
              if (output.rslt_cls == '1') {
                self.phaseDiagData = output;
                self.visibleData = false;
              } else {
                self.visibleData = true;
                let rslt_msg = output.rslt_msg;
                self.$alert(rslt_msg, '', {
                  confirmButtonText: self.$t("common.confirm")
                });
              }
            }
          } else {
            self.visibleData = true;
            self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
              confirmButtonText: self.$t("common.confirm"),
            });
          }
        } else {
          self.visibleData = true;
        }
      });
    },
  },
  mounted() {
    const self = this;
    self.getPhaseDiag();
  },
}
</script>

<style scoped>
.container {
  position: relative;
}
.dimmer,
.infoi {
  /*width: 100%;
  height: 100%;*/
  position: absolute;
  top: 50px;
  left: 58px;
  bottom: 9px;
  right: 0;
}
.infoi {
  z-index: 10;
}
</style>
