<template>
   <div style="width:100%; height: 100%; display: flex; flex-direction: column;">
    <div style="margin: 0 10px;">
      <div style="display: flex; margin-bottom: 2px;">
        <div style="flex:1; font-weight:600; font-size: 12px; line-height: 28px; background-color:#1453AF; color:#FFF; margin-right: 8px; padding-left:10px;">
          자동매매 전략
        </div>
        <div style="margin-right:5px;">
          <el-button plain size="mini" type="info" @click="dropStra" :disabled="signalSeq == ''">
            <i class="el-icon-delete"></i>
          </el-button>
        </div>
        <div>
          <el-button-group>
            <el-button plain size="mini" type="info" @click="prevStra"><i class="el-icon-caret-left"></i></el-button>
            <el-button plain size="mini" type="info" @click="nextStra"><i class="el-icon-caret-right"></i></el-button>
          </el-button-group>
        </div>
      </div>
    </div>

    <div ref="chart" class="chart_cont_bx" style="flex:1;">
        <div v-if="!signalSeq" class="favorite-btn" style="height:100%;" @click="registerStra">
          <p>관심 전략을 등록하세요.
              <br />(최대 3개 등록가능)
          </p>
        </div>

        <div v-else style="margin-top:0; display: flex; justify-content: center; align-items: center; height:100%;">

          <table style="width:100%;">
            <colgroup>
              <col style="width: 20%;">
              <col >
              <col style="width: 30%;">
            </colgroup>
            <tbody>
              <tr @click="moveDetailPage(signalSeq)">
                <td style="position: relative;">
                  <div class="inter-icon-img"
                        style="top:50%; left: 50%; transform: translate(-50%, -50%);"
                        v-bind:style="{ backgroundImage: 'url(' + expertImage(signalSeq,logoKey) + ')'}">
                  </div>
                </td>
                <td>
                  <div class="product-info">
<!--                      <font style="font-size:12px">관심자동매매전략</font>-->
                    <strong class="title">{{ strgMarketNm }}</strong>
                    <div class="etc">
                      <span class="space"><!-- {{ $t("ranking.a009-1") }} 거래소 --> {{ exId }}</span>
                      <span class="space"><!-- {{ $t("ranking.a009-3") }} 종목명 --> {{ jongCd }}</span>
                      <p class="product-info-desc">
                        {{ strgInfo | removeTags}}
                      </p>
                    </div>
                  </div>
                </td>
                  <td style="text-align: right; vertical-align: top; padding:3px 10px 0 0;">
                    <span style="font-size:11px">최근 30일 수익률</span><br />
                    <strong :class="colorProfitRate(profitRate)">{{ profitRate | numberFormat3 }}%</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      signalSeq: '',
      exId: '',
      jongCd: '',
      logoKey: '',
      profitRate: '',
      strgMarketNm: '',
      strgInfo:'',

      interCoin:'',

      interStraData: [],
      straIndex: 0,
      totalStraNo: 0,
      savedSeq: ''
    };
  },
  computed: {
    ...mapGetters([ "getUserInfo", "isSocketConnected" ])
  },
  watch: {
    getUserInfo() {
      const self = this;
      if (self.getUserInfo) {
        self.interStraData = [];
        self.getInterStra();
      } else {
        self.interStraData = [];
      }
    }
  },
  methods: {
     expertImage(seq,id) {
      if (id) {
        return process.env.IMG_URL + "/view.php?id=" + id;
      } else {
        //default images
        return require("@/images/coinImage/basic/default.png");
      }
    },
    prevStra() {
      const self = this;
      self.straIndex--;
      if (self.straIndex < 0) {
        self.straIndex = 2;
      }

      self.alocation();
    },
    nextStra() {
      const self = this;
      self.straIndex++;
      if (self.straIndex > 2) {
        self.straIndex = 0;
      }

      self.alocation();
    },

    //메뉴이동
    registerStra(){
      const self = this;

      if(!self.getUserInfo)
      {
         self.$alert("로그인 후에 등록가능합니다.", '', {
          confirmButtonText: self.$t("common.confirm"),
          callback: function() {
              self.$store.commit("setNeedLogin", true);
              self.$store.commit("setLoginCallbackUrl", 'interest');
            }
          });

      }else{

        //저장된 전략 3개 이상인지 체크
        if(parseInt(self.totalStraNo) >= 3 )
        {
          self.$alert("저장된 전략이 3개 이상입니다.", '', {
             confirmButtonText: self.$t("common.confirm"),
          });

        }else{
          self.$router.push({
              name: "AutoTradingMain",
              query: {inter:"registerStra"}
          });
        }
      }
     },

    //전략상세페이지 이동
    moveDetailPage(seq){
       const self = this;

       self.$router.push({
          path: '/auto/TradingAvailStraDetail',
          query: {
            straSeq: seq
          }
        });
    },

    colorProfitRate(val){
        if(parseFloat(val)>0.00)
        {
            return  'num color02'
        }else if(parseFloat(val)<0.00)
        {
            return 'num color03'
        }else
        {
            return 'num color07'
        }
    },
    //삭제 콜백
    dropCallback(queryData) {
      const self = this;
      if (queryData.queryObj) {
        let output = queryData.queryObj.OutBlock1[0];
        if (output != null) {
          if (output.rslt_cls == '1') {
              self.interStraData = [];
              //삭제성공시 리프레쉬
              self.getInterStra();

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
    },
    dropStra(){
      const self = this;
      self.$EventBus.$emit('downChart');
      self.$confirm("해당 전략을 삭제하시겠습니까?", {
        confirmButtonText: self.$t("common.confirm"),
        cancelButtonText: self.$t("common.cancel"),
        dangerouslyUseHTMLString: true,
      }).then(() => {
          self.$EventBus.$emit('upChart');
          let header = { trName: 'at334' }
          let input = {
            InBlock1: [{
              gb	: '2',    //0:조회 1:등록 2:삭제
              enc_user_id: self.getUserInfo.user_id,  //암호화된 ID
              signal_seq	: self.signalSeq,  //코인코드

            }]
          }
          console.log("drop_input", JSON.stringify(input));
          self.$socket.sendProcessByName(header, input, function(queryData) {
            console.log("drop_getInterStra", queryData);
            if (queryData != null) {
                self.dropCallback(queryData)
            }
          });

      }).catch(err => {
        self.$EventBus.$emit('upChart');
        console.log(err)
      });

    },
    alocation(){
        const self = this;
        self.signalSeq = self.interStraData[self.straIndex].signal_seq;
        self.exId = self.interStraData[self.straIndex].exid;
        self.jongCd = self.interStraData[self.straIndex].jong_cd;
        self.logoKey = self.interStraData[self.straIndex].logo_key;
        self.profitRate = self.interStraData[self.straIndex].profit_rate;
        self.strgMarketNm = self.interStraData[self.straIndex].strg_market_nm;
        self.strgInfo = self.interStraData[self.straIndex].strg_info;
    },

    showSavedItem(){
        const self = this;

        const found = self.interStraData.find(obj => obj.signal_seq == self.savedSeq );
        console.log("found:"+JSON.stringify(found));

        self.signalSeq = found.signal_seq;
        self.exId = found.exid;
        self.jongCd = found.jong_cd;
        self.logoKey = found.logo_key;
        self.profitRate = found.profit_rate;
        self.strgMarketNm = found.strg_market_nm;
        self.strgInfo = found.strg_info;

        self.savedSeq = '';
    },
    // 관심전략리스트
    getInterStra() {

      const self = this;
      let header = { trName: 'at334' }
      let input = {
        InBlock1: [{
          gb	: '0',    //0:조회 1:등록 2:삭제
          enc_user_id	:self.getUserInfo.user_id, //사용자ID
          signal_seq: ''     //코인코드

        }]
      }

      console.log("at334_input", JSON.stringify(input));
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("getInterStra", queryData);
        if (queryData != null) {
          if (queryData.queryObj) {
            let output = queryData.queryObj.OutBlock1[0];
            self.totalStraNo = output.out_cnt
            if (output != null) {
                self.interStraData = [];
                let blocks = queryData.queryObj.OutBlock2;
                for (var i = 0; i < 3; i++) {   //한도 3개
                    self.interStraData.push({
                      exid: (blocks[i] == undefined)?'':blocks[i].exid,
                      jong_cd: (blocks[i] == undefined)?'':blocks[i].jong_cd,
                      logo_key: (blocks[i] == undefined)?'':blocks[i].logo_key,
                      profit_rate: (blocks[i] == undefined)?'':blocks[i].profit_rate,
                      signal_seq: (blocks[i] == undefined)?'':blocks[i].signal_seq,
                      strg_market_nm: (blocks[i] == undefined)?'':blocks[i].strg_market_nm,
                      strg_info : (blocks[i] == undefined)?'':blocks[i].strg_info,
                    })
                    console.log("interStraData:" + JSON.stringify(self.interStraData[i]));
                }
                //저장한 아이템 보여주기
                if(self.savedSeq != '')
                {
                    self.showSavedItem();
                }else
                {
                  self.alocation();
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
  created() {
    const self = this;
    if (self.$route.params.straSeq) {
      self.savedSeq = self.$route.params.straSeq;
    }
  },
  mounted() {
    const self = this;
    if (self.isSocketConnected) {
      //관심전략조회
      self.getInterStra();
    }
    self.$EventBus.$on('socketConnected', self.getInterStra);
  },
  beforeDestroy() {
    const self = this;
    self.$EventBus.$off('socketConnected', self.getInterStra);
  }
}
</script>
