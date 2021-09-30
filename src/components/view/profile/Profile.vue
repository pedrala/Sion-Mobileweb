<template>
  <div class="content">

    <div class="profile-wrap">
      <!-- ST: Profile Header -->
      <div class="profile-header">
        <div class="profile-header-container">
          <div class="profile-header-photo">
            <div class="pro-icon-img" v-bind:style="{ backgroundImage: 'url(' + (getUserInfo.profile_image_url ? getUserInfo.profile_image_url : './static/image/no-user.png') + ')'}">
            </div>
            <div class="pro-icon-badge">
              <!-- <i class="el-icon-camera-solid"></i> -->
              <i class="fa fa-camera"></i>
            </div>
          </div>
          <div class="profile-header-name">
            <router-link v-wave :to="{ name:'ProfileInfoMain' }">
              {{ getUserInfo.user_nnm }}
			<!-- <i class="fa fa-angle-right"></i> -->
              <i class="el-icon-caret-right"></i>
              <!-- 회원정보수정 -->
            </router-link>
          </div>
        </div>
      </div>
      <!-- EN: Profile Header -->

      <!-- ST: Profile Body -->
      <div class="profile-body">
        <div class="profile-body-link">
          <el-row>
            <el-col :span="8" >
              <el-button v-wave type="text" @click="apiManager">
                <span class="icon-img">
                  <img :src="require('@/images/nav/user-m1.svg')" />
                </span>
                API 관리
              </el-button>
            </el-col>
            <el-col :span="8" >
              <el-button v-wave type="text" @click="pointManager">
                  <span class="icon-img">
                    <img :src="require('@/images/nav/user-m2.svg')" />
                  </span>
                포인트 관리
              </el-button>
            </el-col>
            <el-col :span="8" >
              <el-button v-wave type="text" @click="noticeManager">
                  <span class="icon-img">
                    <img :src="require('@/images/nav/user-m3.svg')" />
                  </span>
                알림 관리
              </el-button>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8" >
              <el-button v-wave type="text" @click="faq">
                  <span class="icon-img">
                    <img :src="require('@/images/nav/user-m4.svg')" />
                  </span>
                FAQ
              </el-button>
            </el-col>
            <el-col :span="8" >
              <el-button v-wave type="text" @click="qna">
                  <span class="icon-img">
                    <img :src="require('@/images/nav/user-m5.svg')" />
                  </span>
                1:1 문의
              </el-button>
            </el-col>
            <el-col :span="8" >
              <el-button v-wave type="text" @click="intro">
                  <span class="icon-img">
                    <img :src="require('@/images/nav/user-m6.svg')" />
                  </span>
                소개
              </el-button>
            </el-col>
          </el-row>
        </div>


        <p class="store-text"  style="text-align:left;">
          <span >자동매매 운용중</span>
        </p>

        <el-table :data="runningStraData" ref="tableRef" :show-header="false" empty-text="API Key 등록하고 자동매매를 시작하세요." class="table" style="margin-top: 0;">
          <el-table-column width="80">
            <template slot-scope="scope">
              <div class="pro-icon-img" v-bind:style="{ backgroundImage: 'url(' + expertImage(scope.row.strg_pack_seq,scope.row.logo_key) + ')'}">
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="signal_name" @click="goDetailViewOnRunningStra(scope.row)" header-align="right">
            <template slot-scope="scope">
              <div @click="goDetailViewOnRunningStra(scope.row)">
                <div class="product-info">
                  <div class="badges">
                    <div v-if="scope.row.status== 'X'"><!-- 실행불가 -->
                      <span :class="'badge badge-bg01'">{{ scope.row.status| statFormat }}</span>
                    </div>
                    <div v-if="scope.row.status== 'S'"><!-- 실행대기 -->
                      <span :class="'badge badge-bg02'">{{ scope.row.status| statFormat }}</span>
                    </div>
                    <div v-if="scope.row.status== 'A'"><!-- 실행중 -->
                      <span :class="'badge badge-bg03'">{{ scope.row.status| statFormat }}</span>
                    </div>
                    <strong :class="colorProfitRate(scope.row.profit_rate)">{{ scope.row.profit_rate | numberFormat2 }}%</strong>
                  </div>
                  <strong class="title">{{ scope.row.strg_market_nm }}</strong>
                  <div class="etc">
                    <span class="space"><!-- {{ $t("ranking.a009-1") }} 거래소 --> {{ scope.row.exid }}</span>
                    <span class="space"><!-- {{ $t("ranking.a009-3") }} 종목명 --> {{ scope.row.jong_cd }}</span>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- EN: Profile Body -->
    </div>

  </div>

</template>

<script>
import { mapGetters } from "vuex";
import detail from "../auto/TradingAvailStraDetail";
import { sendApi } from '@/api';
export default {
  components: {
    detail
  },
  computed: {
    ...mapGetters(['getUserInfo', 'isSocketConnected'])
  },
  data() {
    return {

      signal_name: '', //시그널전략명

      //-운용전략리스트
      loading: '',
      runningStraData: [],

    };
  },
  filters:
  {
    statFormat(val){
      const self = this;
      if(val=='S')
      {
        return '실행대기'

      }else if(val=='A')
      {
        return '실행중'

      }else if(val=='X')
      {
        return '실행불가'
      }
    }
  },
  methods: {
    expertImage(seq,id) {
      if (id) {
        // console.log("expertImage_id_seq:"+seq,id)
        return process.env.IMG_URL + "/view.php?id=" + id;
      } else {
        //default images
        return require("@/images/coinImage/basic/default.png");
      }
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

    goDetail(){
      const self = this;
      self.$router.push({ name: "ProfileInfoMain" });

    },
    getData() {
      const self = this;
      self.getRunningStra();
    },
    //운용전략리스트 조회
    getRunningStra() {
      const self = this;
      console.log("getRunningStra start");

      let userId = '';
      if(self.getUserInfo != null)
      {
        userId = self.getUserInfo.user_id;  //'iZxE:d2iOo'
      }
      let header = { trName: 'at316' }
      let input = {
        InBlock1: [{
          enc_user_id	:userId //self.getUserInfo.user_id, //사용자ID

        }]
      }

      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("getRunningStra:", queryData);
        if (queryData != null) {
          if (queryData.queryObj) {
            let output = queryData.queryObj.OutBlock1[0];
            self.total = parseInt(queryData.queryObj.OutBlock1[0].out_cnt);
            if (output != null) {
              if (output.rslt_cls == '1') {
                let tmpList = queryData.queryObj.OutBlock2;
                if (tmpList.length > 0) {

                  self.runningStraData = self.runningStraData.concat(tmpList);
                }

                if (output.out_cnt * 1 == 0) {

                } else {

                }

                self.currentPage += 1;
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
        } else {

        }
      });
    },
    //운용 전략 상세페이지 이동
    goDetailViewOnRunningStra(row) {
      const self = this;
      self.selectedRow = row;
      self.$router.push({
        name: "AutoTradingRunningStraDetail",
        query: { straSeq: row.strg_pack_seq}
      });
    },
    apiManager(){
      const self = this;
      self.$router.push('/profile/api/api');
    },
    pointManager(){
      const self = this;
      self.$router.push('/profile/point/point');
    },
    noticeManager(){
      const self = this;
      self.$router.push('/profile/notice/notice');
    },
    faq(){
      const self = this;
      self.$router.push('/profile/faq');

    },
    qna(){
      const self = this;
      self.$router.push('/profile/qna/list');

    },
    intro(){
      const self = this;
      self.$router.push({name: "HomeTaste"});
    },

  },
  mounted(){
    const self = this;
    console.log("profile")
    if (self.isSocketConnected) {
      self.getData();
    } else {
      self.$EventBus.$on('socketConnected', self.getData);
    }
  },
  created() {
    const self = this;
    self.$EventBus.$emit("setLogo", {
      type: "",
      text: "프로필" //self.$t('expert.a001')
    });
    self.$EventBus.$emit("setMenuIndex", "3-1");
  },
  beforeDestroy() {
    const self = this;
    self.$EventBus.$off('socketConnected', self.getData);
    self.$EventBus.$off("changeLangType", self.changeLangType);
  }

}
</script>

<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  border-radius: 100%;
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
</style>
