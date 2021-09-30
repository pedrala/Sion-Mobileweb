<template>
  <div class="sion-score">
    <h3>기술지표진단<el-button @click="goGuide" size=mini class="guide-btn"><i class="el-icon-info"></i></el-button></h3>

    <div v-if="visibleData" style="flex:1;"><!-- 해당 자료가 없습니다.--></div>

    <div v-else style="flex:1; padding:0; display: flex; align-items: center; justify-content: center;">
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
<!--            <th>저조</th>
            <th>중립</th>
            <th>주의</th>
            <th>과열</th>-->
          </tr>
        </thead>
        <tbody>
          <tr :class="'color-' + techIndiDiagData.trend_color">
            <th :class="'slope-' + techIndiDiagData.trend_slope">
              <span>추 &nbsp;&nbsp; 세</span>
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
          <tr :class="'color-' + techIndiDiagData.m_color">
             <th :class="'slope-' + techIndiDiagData.m_slope">
              <span>모멘텀</span>
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
          <tr :class="'color-' + techIndiDiagData.v_color">
             <th :class="'slope-' + techIndiDiagData.v_slope">
              <span>변동성</span>
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
          <tr class="tfoot" :class="'color-' + techIndiDiagData.tot_color">
            <th :class="'slope-' + techIndiDiagData.tot_slope">
              <span>종 &nbsp;&nbsp; 합</span>
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

    <!-- 기술지표진단 도움말 -->
    <el-dialog :visible.sync="visibleGuide" class="mob modal modal-turms score-guide" width="100%" top="0px" append-to-body>
      <template slot="title">
        <div>
          <span class="el-dialog__title"><b>기술지표진단</b></span>
        </div>
      </template>
      <div class="section">
        한국금융IT의 멀티 분석용 차트인 <span class="blue">K-Chart, Signal Maker</span> 솔루션 활용하여 점수화 제공<br><br>
        차트의 기술적 분석지표를 활용하여 산정<br><br>
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
        시장 상황에 대한 이해를 돕고자 가격 데이터를 여러 기술적 지표 등을 적용, 분석화하여 시각화, 점수화 한 것입니다.
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
        <ul class="slope-guide">
          <li>
            <span>상   승</span>
            <div class="slope slope-5">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="9" viewBox="0 7.469 24 9">
                <path fill="none" d="M0,0h24v24H0V0z"/>
                <path class="arrow" d="M15.938,11H0.969v2h14.969v3l7.484-4l-7.484-4V11z"/>
              </svg>
            </div>
          </li>
          <li>
            <span>강 보합</span>
            <div class="slope slope-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="9" viewBox="0 7.469 24 9">
                <path fill="none" d="M0,0h24v24H0V0z"/>
                <path class="arrow" d="M15.938,11H0.969v2h14.969v3l7.484-4l-7.484-4V11z"/>
              </svg>
            </div>
          </li>
          <li>
            <span>횡 보</span>
            <div class="slope slope-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="9" viewBox="0 7.469 24 9">
                <path fill="none" d="M0,0h24v24H0V0z"/>
                <path class="arrow" d="M15.938,11H0.969v2h14.969v3l7.484-4l-7.484-4V11z"/>
              </svg>
            </div>
          </li>
          <li>
            <span>약 보합</span>
            <div class="slope slope-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="9" viewBox="0 7.469 24 9">
                <path fill="none" d="M0,0h24v24H0V0z"/>
                <path class="arrow" d="M15.938,11H0.969v2h14.969v3l7.484-4l-7.484-4V11z"/>
              </svg>
            </div>
          </li>
          <li>
            <span>하 락</span>
            <div class="slope slope-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="9" viewBox="0 7.469 24 9">
                <path fill="none" d="M0,0h24v24H0V0z"/>
                <path class="arrow" d="M15.938,11H0.969v2h14.969v3l7.484-4l-7.484-4V11z"/>
              </svg>
            </div>
          </li>
        </ul>
      </div>
      <div slot="footer" >
        <el-button @click="directionGuideClose" style="border-radius: 0; height: 55px; line-height: 55px;" class="button button-bg03 block" >{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>

    <!-- <el-dialog class="mob modal modal-turms score-guide" title="도움말" :visible.sync="visibleGuide" :show-close="true" width="100%" center style="margin:220px 40px;overflow:hidden;" top="0px" :close-on-click-modal="true" append-to-body>
      <div class="section" style="padding-bottom: 10px;font-size:12px">
        <ul>
          <li> - 로그인 후에 보실 수 있습니다.   </li>
          <li> - 회원이 아니시면 회원가입 부탁드립니다.    </li>
        </ul>
      </div>

      <div slot="footer" >
        <el-button-group  style="width:100%">
          <el-button @click="goLogin" type="primary" size="small" plain style="width:50%;">회원가입 바로가기 </el-button>
          <el-button @click="visibleGuide = false" type="primary" size="small" style="width:50%;">{{ $t("common.confirm") }}</el-button>
        </el-button-group>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
export default {
  props: [ 'symbol','direction' ],
  watch: {
    symbol() {
      const self = this;
      self.getTechIndiDiag();
    }
  },
  data() {
    return {
      visibleData: true,
      visibleDirectionGuide: false,
      visibleGuide: false,
      techIndiDiagData: {},
      time:'2'
    };
  },
  methods: {
    goGuide(){
      const self = this;
      setTimeout(function() {
        self.visibleGuide = true;
        self.$EventBus.$emit('downChart');
			}, 100)
    },
    guideClose() {
      const self = this;
      setTimeout(function() {
        self.visibleGuide = false;
        self.$EventBus.$emit('upChart');
      }, 100)
    },
    goGuideDirection(){
      const self = this;
      setTimeout(function() {
        self.visibleDirectionGuide = true;
        self.$EventBus.$emit('downChart');
			}, 100)
    },
    directionGuideClose() {
      const self = this;
      setTimeout(function() {
        self.visibleDirectionGuide = false;
        self.$EventBus.$emit('upChart');
      }, 100)
    },
    sendTime(val) {
      const self = this;
      self.time = val.time;
      if(val.direction == self.direction)
        self.getTechIndiDiag();
    },
    //기술지표진단 조회
    getTechIndiDiag() {
      const self = this;
      let header = { trName: 'at340' }
      let input = {
        InBlock1: [{
          gubun	: self.time, //1:1분, 2:일, 3:주, 4:월, 5:종합
          symbol: self.symbol
        }]
      }

      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("getTechIndiDiag", queryData);
        if (queryData != null) {
          if (queryData.queryObj) {
            let output = queryData.queryObj.OutBlock1[0];
            if (output != null) {
              if (output.rslt_cls == '1') {
                self.techIndiDiagData = output;
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
    self.getTechIndiDiag();
  },
  created() {
    const self = this;
    self.$EventBus.$on('sendTime', self.sendTime);
  },

  beforeDestroy() {
    const self = this;
    self.$EventBus.$off('sendTime', self.sendTime);
  }
}
</script>
