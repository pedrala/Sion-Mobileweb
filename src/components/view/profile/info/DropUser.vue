<template>
	<!-- <el-dialog :title="$t('mypage.d103.a001')" :visible.sync="dialogVisible" width="100%" top="0px" :close-on-click-modal="false" class="mob modal"> -->
		<div class="section">
			<strong class="color02">{{ $t('mypage.d103.a002') }}<!-- 탈퇴 전 확인해주세요! --></strong>
			<ul class="text-etc">
				<li>1. {{ $t('mypage.d103.a003') }}<!-- 현재 클라이언트 또는 서버에서 실행중인 전략이 존재할 경우 회원탈퇴가 불가합니다. --></li>
        <li>2. {{ $t('mypage.d103.a004') }}<!-- 포인트 잔여가 남아있는 경우 탈퇴시 잔고는 삭감 처리 됩니다. --></li>
        <li>3. {{ $t('mypage.d103.a005') }}<!-- 회원탈퇴 시 한국금융IT에 등록된 개인정보는 모두 삭제되며 복귀되지 않습니다. --><br>
          <span class="color04">{{ $t('mypage.d103.a006') }}<!-- 단, 관계법령에 따라 회사가 보관해야하는 정보는 일정 기간 보관됩니다. --></span>
        </li>
			</ul>

			<el-button class="certifi" @click="myAuth">
				<i class="icon-phone"></i>
				<strong class="name">{{ $t('mypage.d103.a007') }}<!-- 휴대폰 본인인증 --></strong>
			</el-button>

      <input type="checkbox" v-model="chkAgree" class="checkbox"><span style="font-size:12px"> {{ $t('mypage.d103.a010') }}</span>

			<!-- <el-button v-wave v-model="chkAgree">	
        <i class="icon-check-square-o"></i>
        회원탈퇴 유의사항 동의 (필수)
      </el-button> -->

			<div class="btns">
				<el-button @click="checkRunningStra" class="button button-bg06 block">{{ $t('mypage.d103.a011') }}<!-- 회원탈퇴 --></el-button>
			</div>
		</div>

	<!-- </el-dialog> -->
</template>

<script>
import { sendApi } from '@/api';
import { mapGetters } from "vuex";

export default {
  props: ['email'],
  computed: {
    ...mapGetters(['getUserInfo', 'isSocketConnected'])
  },
  data() {
    return {
      dialogVisible: false,
      chkAgree: false,
      di: '',
      popupId: null,
    };
  },
  methods: {
    updateCallback(queryData) {
      const self = this;
      if (queryData.queryObj) {
        let output = queryData.queryObj.OutBlock1[0];
        if (output != null) {
          self.$EventBus.$emit('downChart');
          if (output.rslt_cls == '1') {
            //로그아웃하고 세션끊기
            self.$EventBus.$emit("goLogout");         
            // 회원탈퇴가 완료되었습니다.<br>SION 서비스를 이용해주셔서 감사합니다.
            self.$alert(self.$t('mypage.d103.a012'), '', {
              dangerouslyUseHTMLString: true,
              confirmButtonText: self.$t('common.confirm'),
              callback: action => {
                self.$EventBus.$emit('upChart');
              }
            });
          } else {
            let rslt_msg = output.rslt_msg;
            self.$alert(rslt_msg, '', {
              confirmButtonText: self.$t('common.confirm'),
              callback: action => {
                self.$EventBus.$emit('upChart');
              }
            });
          }
        }
      } else {
        self.$EventBus.$emit('downChart');
        self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
          confirmButtonText: self.$t("common.confirm"),
          callback: action => {
            self.$EventBus.$emit('upChart');
          }
        });
      }
    },
    pccCallback(e) {
      console.log("DropUser pccCallback", e.detail);
      const self = this;
      // window.removeEventListener('message', self.pccCallback);
      if (self.popupId) {
        self.popupId.close();
      }
      cordova.exec( null , null, "AppPlugin" , "destroyWebView", null);      //본인인증 웹뷰 삭제
      if (e.detail.di) {
        self.di = e.detail.di;
        // 본인인증이 완료되었습니다.
        self.$alert(self.$t('mypage.d103.a013'), '', {
          confirmButtonText: self.$t('common.confirm')
        });
      } else {
        // 본인인증에 실패하였습니다.
        self.$alert(self.$t('mypage.d103.a014'), '', {
          confirmButtonText: self.$t('common.confirm')
        });
      }
    },
    myAuth() {
      const self = this;
      self.di = '';
      // window.removeEventListener('message', self.pccCallback);
      // self.popupId = window.open(process.env.CERT_URL, 'pccPopup', "width=410,height=635");
      cordova.exec(null,null,"AppPlugin","loadWebView",[0,0,1,1,'',process.env.CERT_URL]);
      // window.addEventListener('message', self.pccCallback);
    },    
    //운용전략 있는지 조회
    checkRunningStra() {
      const self = this;
      let header = { trName: 'at316' }
      let input = {
        InBlock1: [{
          enc_user_id	: self.getUserInfo.user_id, //사용자ID
        }]
      }   
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("checkRunningStra:", queryData);
        if (queryData != null) {
          if (queryData.queryObj) {
            let output = queryData.queryObj.OutBlock1[0];
            if (output != null) {
              if (output.rslt_cls == '1') 
              {              
                if (parseInt(output.out_cnt) > 0) 
                {                               
                  // 운용중 전략 존재
                  self.$alert(self.$t('sys_err.00004'), '', {
                    confirmButtonText: self.$t('common.confirm')
                  });                
                }else{                
                 self.dropUser()
                }                
              }
            }
          } 
        }
      });    
    
    },
    dropUser() {
      const self = this;
      if (self.di == '') {
        // 본인인증을 완료하셔야 합니다.
        self.$alert(self.$t('mypage.d103.a015'), '', {
          confirmButtonText: self.$t('common.confirm')
        });
      } else if (self.chkAgree == false) {
        // 회원탈퇴 유의사항에 동의하셔야 합니다.
        self.$alert(self.$t('mypage.d103.a016'), '', {
          confirmButtonText: self.$t('common.confirm')
        });
      } else {
        let header = { trName: 'at099' }
        let input = {
          InBlock1: [{
            enc_user_id: self.getUserInfo.user_id,
            cert_key: self.di,
          }]
        }
        self.$socket.sendProcessByName(header, input, function(queryData) {
          console.log("dropUser", queryData);
          if (queryData != null) {
            self.updateCallback(queryData);
          }
        });
      }
    }, 
    getData() {
      const self = this;
      self.chkAgree = false;
      self.dialogVisible = true;
    },
  },
  created() {
    const self = this;
    self.$EventBus.$emit("setLogo", {
      type: "",
      text: "회원탈퇴"
    }); 
    self.$store.commit("setIsDrop", true);
  },
  mounted() {
     const self = this;
     self.getData();
     window.addEventListener('pccCallback', self.pccCallback);
  },
  beforeDestroy() {
    const self = this;
    self.$store.commit("setIsDrop", false);
  },
  destroyed(){
		window.removeEventListener('pccCallback', this.pccCallback);
	}
}
</script>
