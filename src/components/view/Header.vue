<template>
  <div>
    <router-link v-if="!viewBackBtn" v-wave :to="{ path: isLoggedIn?'/home/interest':'/home/taste' }" class="logo">
			<img src="../../../static/image/img_logo.png" alt="SION" />
		</router-link>
    <div v-else>
      <span style="line-height:45px;"><el-button @click="goBack" class="button-back icon-back"></el-button></span>
      <span v-if="showTitle" style="width:calc(100% - 100px);text-align: center;" class="menuTitle">{{ logoInfo.text }}</span>
    </div>

    <div v-if="showTitle==false">
      <div v-if="getUserInfo" class="login">
        <el-button v-if='logoInfo.name=="noticeList"' @click="goSetting"><i style="font-size: 20px;" class="el-icon-setting"></i></el-button>
        <el-button v-else @click="goLogout">로그아웃</el-button>
      </div>
      <div v-else class="login">
        <el-button @click="loginRegister">로그인/가입하기<i class="el-icon-user"></i></el-button>        
      </div>
    </div>

    <login-dialog></login-dialog>

    <!-- <span class="version">
      <h1 class="title">{{ getAppVersion.appVersion}}</h1>
    </span> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { sendApi } from '@/api';
import loginDialog from "./common/loginDialog";
export default {
  components: {
	  loginDialog
  },
  computed: {
    ...mapGetters([ 'isLoggedIn', 'getUserInfo', 'getAppVersion' ])
  },
  data() {
    return {
      logoInfo: {
        type: 'main',
        text: '',
      },

      langType: '',
      detailPagesNm: [
        'AutoTradingAvailStraDetail',
        'AutoTradingRunningStraDetail',
        'AutoTradingHistory',
        'SisePrice',
        'SiseChart',
        'ProfileApiMain',
        'ProfileApiRegister',
        'ProfilePointMain',
        'ProfileNoticeMain',
        'ProfileNoticeSetting',
        'ProfileFaq',                     
        'ProfileInfoMain',
        'ProfileInfoPassword',
        'ProfileInfoEmail',
        'ProfileInfoImageNick',
        'ProfileInfoEtc',
        'ProfileInfoDrop',   
        'ProfileQnAList',                                       
        'ProfileQnAWrite',
        'ProfileQnAView',                    
        'TimeLineView'
      ],
      viewBackBtn:'',
      showTitle: false
    };
  },
  watch: {
    $route (to, from){
      const self = this;
      self.viewBackBtn = self.detailPagesNm.includes(to.name)
     // console.log("viewBack:"+self.viewBack)
    }
  },
  methods: {
    goSetting() {
      const self = this;
      self.$router.push("/profile/notice/noticeSetting");
    },
    goBack() {
      history.back(-1);
    },
    goLogout()
    {
      const self = this;

      //kakao logout
      try {
        window.KakaoCordovaSDK.logout(
          function(response) {
            console.log("kakao logout success", JSON.stringify(response));				
          }, function(error) {
            alert("fail...");
            console.log("kakao logout" , JSON.stringify(error));
          }
        );
      } catch (e){
        console.log(e);
      }
      

			let header = {
				trName: 'at010'
			}
			let input = {
				InBlock1: [{
				EncUserId: self.getUserInfo.user_id, //암호화된ID
				SesnId: self.getUserInfo.sess_id, //세션ID
				}]
			}
			self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("goLogout", queryData);
        
				sendApi('/user/logout', null, () => {
				self.$store.commit("SET_USERINFO", null);
					self.$router.push('/home/taste');
				});
			});
    },  
    
    loginRegister() {
      const self = this;
      self.$store.commit("setNeedLogin", true);
    },

    setLogo(logoInfo) {
      const self = this;
      if (logoInfo.showTitle) {
        self.showTitle = logoInfo.showTitle;
      } else {
        self.showTitle = false;
      }
      self.logoInfo = logoInfo;
    },

    setLangType() {
      const self = this;
      let header = {
        trName: 'at001'
      }
      let input = {
        InBlock1: [{
          enc_user_id: self.getUserInfo.user_id,
          sel_gb: 1,
          lang_pack: self.$i18n.locale
        }]
      }
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("setLangType", queryData);
        self.$EventBus.$emit("changeLangType");
      });
    },
    //알림설정 이동
    goNoticeSetting()
    {
      const self = this;
      self.$router.push({ path: "/profile/notice/noticeSetting"});
    },

    //유투브 사용법
    onIntroduceService() {
      const self = this;
      self.$router.push({ path: "/intro/service", query: { tab: 1, type: 'V' } });
    },

    pushLangType(langType) {
      const self = this;
      self.langType = langType;
    }
  },
  created() {
    const self = this;
    self.$EventBus.$on("setLogo", self.setLogo);
    self.$EventBus.$on('goLogout', self.goLogout);
  },
  mounted() {
  },
  beforeDestroy() {
    const self = this;
    self.$EventBus.$off("setLogo", self.setLogo);
    self.$EventBus.$off('goLogout', self.goLogout);
  }
}
</script>
