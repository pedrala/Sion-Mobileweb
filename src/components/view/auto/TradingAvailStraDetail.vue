<template>
<div class="content product-detail">
    <div width="100%" top="0" class="mob modal modal-type03">
       <div slot="title" class="modal-head product-detail-head">
          <div class="product-detail-head-img">
              <div class="pro-icon-img" v-bind:style="{ backgroundImage: 'url(' + expertImage(strgData.logo_key) + ')'}">      
              </div>
          </div>
          <div class="product-info">
							<div class="badges">
								<strong :class="colorProfitRate(strgData.profit_rate)">
                  <span>{{ strgData.profit_rate | numberFormat3 }}%</span>
                </strong>
							</div>
              <strong class="title">{{ strgData.strg_market_nm }}</strong>
            	<div class="etc">
								<span class="space">{{ strgData.exid }}</span>
                <span class="space">{{ strgData.jong_cd }}</span>
							</div>
        	</div>

      </div>

      <div class="heading depth01">
        <h2 class="title">
          수익률
          <el-radio-group v-model="assetGb" size="mini" @change="assetGbChange">
            <el-radio-button label="1">금액</el-radio-button>
            <el-radio-button label="2">수량</el-radio-button>
          </el-radio-group>
          <el-popover placement="bottom-end" width="250" title="" trigger="hover">
            <p class="pop-msg">
              매일 오전 9시 잔고 기준으로 일별 수익률이 계산됩니다.<br>
              입출금이 일어날 경우 수익률이 왜곡될 수 있습니다.
            </p>
            <span slot="reference"><i class="el-icon-info"></i></span>
          </el-popover>
        </h2>
        <span class="btn-toggle">
          <span style="font-size:12px; height:40px;line-height:40px"><b>최근 30일 수익률</b></span>
        </span>
      </div>

      <!-- 실적차트 -->
      <div class="product-detail-chart">
        <div width="100%" style="height: 200px; border: 1px solid #dadada">
          <expert-record :yieldData="yielddata" :gb='0'></expert-record>
        </div>
      </div>

      <div class="heading depth01">
        <h2 class="title"> 이용조건</h2>
      </div>
      <div class="product-detail-terms">
        <ul>
          <li><span class="key-title">최소포인트</span>{{ pointAssetData.limit_p | numberFormat }} P</li>
          <li v-if="isLoggedIn">
            <span class="key-title">보유포인트</span>
            <span>
               <span :class="colorProfitRate(parseInt(pointAssetData.limit_p) - parseInt(pointAssetData.point))">
                 <b>{{ pointAssetData.point | numberFormat }}</b>
               </span> P
            </span>
          </li>

          <li><span class="key-title">최소자산</span>{{ pointAssetData.limit_asset |numberFormat2 }} {{ pointAssetData.unit }}</li>
          <li v-if="getUserInfo">
            <span class="key-title">보유자산</span>
            <span>
              <span :class="colorProfitRate(parseInt(pointAssetData.limit_asset) - parseInt(pointAssetData.marginbalance))">
              <b>{{ pointAssetData.marginbalance|numberFormat2 }}</b>
              </span>
              {{ pointAssetData.unit }}
            </span>
          </li>
        </ul>
      </div>

      <div v-if="isLoggedIn">
        <div v-if="seen1">
          <div class="heading depth01" style="margin: 30px 0px 5px 10px;">
            <h2 class="title">이용조건 요건을 확인해 주세요.</h2>
          </div>
        </div>
        <div v-if="seen3" style="margin:0 20px;">
          <el-row style="margin: 15px 0;">API 키를 등록해 주세요.</el-row>
          <el-row>
            <el-button type=primary style="width:150px;height:40px;"  @click="apiRegister">API 키 등록</el-button>
          </el-row>
        </div>
        <div v-if="seen4" style="margin:0 20px;">
          <el-row style="margin: 15px 0;">포인트를 충전해 주세요.</el-row>
          <el-row>
            <el-button type="primary" style="width:150px;height:40px;" @click="pointRecharger">포인트 충전</el-button>
          </el-row>
        </div>
        <div v-if="seen5" style="margin:15px 20px;">
          <p>해당 거래소의 <span style="color:red">보유자산이 최소 자산 이상 충족되어야</span> 자동매매 등록이 가능합니다.</p>
        </div>

        <div v-if="seen2">
          <div class="heading depth01" style="margin: 30px 0px 5px 10px;">
            <h2 class="title">자동매매 등록 전 꼭 확인해 주세요.</h2>
          </div>
        </div>
        <div v-if="seen6" style="margin:15px 20px;">
          <span style="color:red">거래소당 하나의 전략만 운용가능하며, 동일 거래소로 운용중인 전략이 존재합니다. 교체를 원하시는 경우 자동매매 운용중 에서 해당 거래소의 등록전략 삭제 후 다시 등록해주세요.</span>
        </div>
        
        <div v-if="!autoRegiDisabled" style="margin:15px 20px;">
          <p>정상적인 자동매매 알고리즘을 위해 해당 거래소에<span style="color:red">미체결 건 또는 현재 진입 포지션이 없는 상태</span>임을 꼭 확인 후 실행해주세요.</p>
        </div>
        <div style="margin: 15px 0;padding: 0px 10px;" align="center">
          <el-button type="primary" :disabled="autoRegiDisabled" style="width:100%;" @click="autoTradingRegister">자동매매 등록</el-button>
        </div>

        <div class="heading depth01" style="margin: 25px 0px 5px 10px;">
          <h2 class="title">전략소개</h2>
        </div>
        <div class="msg-text" style="margin-top: 0px;margin-bottom: 60px;" v-html="pointAssetData.strg_info">
          <!-- <p class="sub-text">{{ pointAssetData.strg_info | removeTags }}</p> -->
        </div>
      </div>

      <div v-else class="goto-login">
        <div class="heading depth01">
          <h2 class="title">자동매매를 등록하려면 로그인이 필요합니다.</h2>
        </div>
        <div class="btn-login-wrap" style="">
          <el-button type=primary class="block" @click="login">로그인</el-button>
        </div>
        <div class="btn-register-wrap">
          <el-link @click="goRegistration" class="underline color06 member">회원이 아니신가요? 회원가입 바로가기 ></el-link>
        </div>
      </div>
    </div>

    <register-guide></register-guide>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ExpertRecord from "../auto/SignalExpertRecord";
import RegisterGuide from "../auto/RegisterGuide";

export default {
  components: {
    ExpertRecord,
    RegisterGuide
  },
  data() {
    return {
      //전략상세
      strgData: {},

      //보유포인트, 보유자산
      pointAssetData: {},

      //성과분석(수익률 그래프)
      yielddata: [],
      assetGb: '1', //1.금액 2.수량

      //노출 여부
      seen1: false,
      seen2: false,
      seen3: false,
      seen4: false,
      seen5: false,
      seen6: false,
      seen7: false,
      autoRegiDisabled: true
    };
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'getUserInfo', 'isSocketConnected'])
  },
  watch: {
    //상단 데이터 고정
    isLoggedIn(val, old) {
      const self = this;
      
      

      self.getUseCondition();
    }
  },
  methods: {
    expertImage(id) {
      if (id) {
        return process.env.IMG_URL + "/view.php?id=" + id;
      } else {
        return require("@/images/coinImage/basic/default.png");
      }
    },
    colorProfitRate(val) {
      if (parseFloat(val) > 0.00) {
        return 'num color02';
      } else if(parseFloat(val) < 0.00) {
        return 'num color03';
      } else {
        return 'num color07';
      }
    },
    login() {
      const self = this;
      self.$store.commit("setNeedLogin", true);
    },
  	goRegistration() {
      const self = this;
			console.log("goRegistration");
			self.drawer = false;
			self.$router.push('/registration');
		},
    //이용조건 (보유포인트, 보유자산, 최소포인트, 최소자산)
    getUseCondition() {
      const self = this;

      self.seen1 = false;
      self.seen2 = false;
      self.seen3 = false;
      self.seen4 = false;
      self.seen5 = false;
      self.seen6 = false;
      self.seen7 = false;
      self.autoRegiDisabled = true;
      
      let header = { trName: 'at314' }
      let input = {
        InBlock1: [{
          user_id: self.isLoggedIn?self.getUserInfo.user_id:'', //사용자ID
          strg_pack_seq: self.strgKey,                          //패키지전략키
        }]
      }
      console.log("input_at314:"+JSON.stringify(input));
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("getUseCondition", queryData);
        if (queryData != null) {
          if (queryData.queryObj) {
            self.pointAssetData = queryData.queryObj.OutBlock1[0];         
            if (self.pointAssetData.rslt_cls == '1') {
              //이용조건 요건을 확인해주세요
              if (self.pointAssetData.apikey_gb	== 'N') {
                self.seen1 = true;
                self.seen3 = true
              } else {
                if (self.pointAssetData.asset_gb == 'N') {
                  self.seen1 = true;
                  self.seen5 = true;
                }
              }
              if (self.pointAssetData.point_gb == 'Y') {
                self.seen1 = true;
                self.seen4 = true;
              }

              //자동매매 등록 전 꼭 확인해주세요
              if (self.seen1 == false) {
                self.seen2 = true;
                if (self.pointAssetData.use_gb == 'Y') {
                  self.seen6 = true;
                } else {
                  self.autoRegiDisabled = false;
                }
              }
            } else {
              let rslt_msg = self.pointAssetData.rslt_msg;
              self.$alert(rslt_msg, '', {
                confirmButtonText: self.$t("common.confirm")
              });
            }
          } else {
            self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
              confirmButtonText: self.$t("common.confirm"),
            });
          }
        }
      });
    },
    apiRegister(){
      //   체크 우선순위
      // 1. 로그인
      // 2. API KEY 등록 상태
      // 3. 포인트 충족 여부
      // 4. 보유 자산 충족 여부
      // 5. 해당 전략 실행 중 체크

      const self = this;
    	if (self.isLoggedIn) {
				self.$router.push('/profile/api/api');
			}
    },
    pointRecharger(){
      const self = this;
    	self.$router.push('/profile/point/point');
    },
    //자동매매등록
    autoTradingRegister(){
      const self = this;
      //등록 유의사항팝업
      self.$EventBus.$emit("openRegisterGuide", self.strgData);
    },
    //옵션 변경시 수익률 재조회
    assetGbChange(){
      const self = this;
      self.yielddata = [];
      self.lookupResultList();
    },
    //수익률(그래프)
    lookupResultList() {
      const self = this;
      let header = { trName: 'at315' }
      let input = {
        InBlock1: [{
          strg_pack_seq: self.strgKey, //패키지전략키
          data_gb: self.assetGb        //1:금액(KRW) 2:수량
        }]
      }
      console.log("input_at315", JSON.stringify(input));
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("lookupResultList", queryData);
        if (queryData != null) {
          if (queryData.queryObj) {
            let output = queryData.queryObj.OutBlock1[0];
            if (output.rslt_cls == '1') {
              self.yielddata = queryData.queryObj.OutBlock2;
              self.yielddata = self.yielddata.slice(0, 60)
            }
          } else {
            self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
              confirmButtonText: self.$t("common.confirm"),
            });
          }
        }
      });
    },
    getStraDetail() {
      const self = this;
      let header = { trName: 'at310' }
      let input = {
        InBlock1: [{
          strg_pack_seq: self.strgKey,
          page_no: '1',
          page_div_cnt: '20'
        }]
      }
      console.log("InBlock1_at310:"+JSON.stringify(input));
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("getStraDetail:", queryData);
        if (queryData != null) {
          if (queryData.queryObj) {
            let output = queryData.queryObj.OutBlock1[0];          
            if (output != null) {
              if (output.rslt_cls == '1') {
                self.strgData = queryData.queryObj.OutBlock2[0];        
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
    getData() {
      const self = this;
      self.getStraDetail();    //전략 상세조회
      self.lookupResultList(); //수익률 그래프
      self.getUseCondition();  //보유포인트,자산조회
    },
  },
  created() {
    const self = this;
    self.strgKey = self.$route.query.straSeq;
    console.log("strgKey:" + self.strgKey);   

    self.$EventBus.$emit("setLogo", {
      type: "",
      text: "자동매매 전략"
    });
    self.$EventBus.$emit("setMenuIndex", "2-2");
  },
  mounted() {
    const self = this;    
    if (self.isSocketConnected) {
      self.getData();
    }
    self.$EventBus.$on('socketConnected', self.getData);
  },
  beforeDestroy() {
    const self = this;
    self.$EventBus.$off("socketConnected", self.getData);
  }
}
</script>

<style>
.image {
  border-radius: 100%;
  width: 100%;
  display: block;
}
</style>
