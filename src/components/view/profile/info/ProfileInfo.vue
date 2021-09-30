<template>
	<div class="bg">
		<div class="section02">
			<el-form>
				<div class="form form-modify full" style="margin-top: 0px;margin-bottom: 60px;">
          <div class="item">
            <div class="in-button" style="height:150px">
						<span class="name">프로필사진</span>	
              <div style="padding: 5px;">		
                 <div class="profile-icon-img" v-bind:style="{ backgroundImage: 'url(' + (getUserInfo.profile_image_url ? getUserInfo.profile_image_url : './static/image/no-user.png') + ')'}"></div>    
                 <div style="display: flex; justify-content: flex-end;margin:50px 0px 50px 100px">
                    <p>{{ data.nick_nm }}</p>  
                 </div>           
                 <el-button class="button" @click="goImageUpload">편집</el-button>   
              </div>
            </div>
					</div>
					<div v-if="getUserInfo.login_gb=='1'" class="item">
						<span class="name">{{ $t('mypage.d003') }}<!-- 아이디 --></span>
						<p class="value color05">{{ data.user_id }}</p>
					</div>
					<div v-if="getUserInfo.login_gb=='1'" class="item">
						<div class="in-button">
							<span class="name">{{ $t('mypage.d004') }}<!-- 비밀번호 --></span>
							<p class="value">{{ data.user_pw | passwordFormat }}</p>
							<el-button class="button" @click="openModifyPassword">{{ $t('mypage.d005') }}<!-- 변경하기 -->
							</el-button>
						</div>
					</div>
					<div class="item">
						<span class="name">{{ $t('mypage.d007') }}<!-- 이름 --></span>
						<p class="value color05">{{ data.user_nm | nameFormat }}</p>
					</div>
					<div class="item">
						<div class="in-button">
							<span class="name">{{ $t('mypage.d008') }}<!-- 휴대폰번호 --></span>
							<p class="value">{{ data.user_phone | phoneFormat }}</p>
							<el-button @click="changePhone" class="button">{{ $t('mypage.d005') }}<!-- 변경하기 -->
							</el-button>
						</div>
					</div>
					<div class="item">
						<div class="in-button">
							<span class="name">{{ $t('mypage.d009') }}<!-- 이메일 --></span>
							<p class="value">{{ data.email | emailFormat }}</p>
							<el-button @click="openModifyEmail" class="button">{{ $t('mypage.d005') }}<!-- 변경하기 -->
							</el-button>
						</div>
					</div>
          <div class="item">
						<div class="in-button">
							<span class="name">기타</span>				
							<el-button @click="openEtc" class="button"> >
							</el-button>
						</div>
					</div>
          <div class="item" > 	<!-- 로그아웃 -->			
            	<div class="in-button" > 
                <el-button v-if="getUserInfo" @click="askLogout" class="button button-bg06" style="width:100%">{{ $t('menu.a008') }}<!-- 로그아웃 --></el-button>
              </div>
          </div>
          <div class="item">           
          </div>
				</div>
      
			</el-form>
		</div>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import { uploadFile } from '@/api/upload'
import { sendApi } from '@/api';

export default {
  computed: {
    ...mapGetters(['getUserInfo', 'isSocketConnected', 'getTurnSeq'])     
  },

  data() {
    return {
      data: {},
      popupId: null  
    };
  },
  filters: {
    passwordFormat(data) {
      if (data) {
        return data.replace(/./g, "*");
      } else {
        return "";
      }
    },
    phoneFormat(data) {
      if (data) {
        data = data.replace(/-/g, "");
        if (data.length == 11) {
          return data.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-****-$3');
        } else {
          return data.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-***-$3');
        }
      } else {
        return "";
      }
    },
    emailFormat(data) {
      if (data) {
        let tmp = data.split("@");
        if (tmp.length != 2) {
          return data;
        } else {
          tmp[0] = tmp[0].substring(0, tmp[0].length - 2);
          return tmp[0] + "**@" + tmp[1];
        }
      } else {
        return "";
      }
    },
  },
  methods: {
    changeLangType() {
        const self = this;
        self.$EventBus.$emit("setLogo", {
          type: "",
          text: "프로필정보"
        }); // 회원정보수정
    }, 
    goImageUpload(){
        const self = this;
        self.$router.push({name: "ProfileInfoImageNick", query:{nickNm:self.data.nick_nm}});
    },
    openModifyPassword() {
        const self = this;
        self.$router.push({ name: "ProfileInfoPassword" });    
    },  
    openModifyEmail() {
        const self = this;
        self.$router.push({name: "ProfileInfoEmail", query: { email: self.data.email } });    
    },
    //기타
    openEtc() {
      const self = this;
      self.$router.push({name: "ProfileInfoEtc"});          
    },  
    updateGb(update_gb, update_data) {
      const self = this;
      let header = { trName: 'at007' }

      const prfKey = self.fileListFilter(self.fileList)

      let input = {
        InBlock1: [{
          enc_user_id: self.getUserInfo.user_id,
          update_gb: update_gb,
          update_data: update_data
        }]
      }
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("updateGb", queryData);
        if (!queryData.queryObj) {
          self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
            confirmButtonText: self.$t("common.confirm"),
          });
        }
      });
    },
    changeSmsGb(val) {
      this.updateGb(5, val ? "Y" : "N");
    },
    changeAutoGb(val) {
      this.updateGb(6, val ? "Y" : "N");
    },
    updateCallback(queryData) {
      const self = this;
      if (queryData.queryObj) {
        let output = queryData.queryObj.OutBlock1[0];
        if (output != null) {
          if (output.rslt_cls == '1') {
            // 휴대폰 번호 변경이 완료되었습니다
            self.$alert(self.$t('mypage.d018'), '', {
              confirmButtonText: self.$t("common.confirm"),
              callback: function() {
                self.reloadInfo();
              }
            });
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
    pccCallback(e) {
      console.log("Info pccCallback", e.detail);
      
      const self = this;
      window.removeEventListener('message', self.pccCallback);
      if (self.popupId) {
        self.popupId.close();
      }
      cordova.exec( null , null, "AppPlugin" , "destroyWebView", null);      //본인인증 웹뷰 삭제
      if (e.detail.di) {
        const di = e.detail.di;
        const phone = e.detail.cellNo;
        let header = { trName: 'at007' }
        let input = {
          InBlock1: [{
            enc_user_id: self.getUserInfo.user_id,
            update_gb: 3,
            check_data: di,
            update_data: phone
          }]
        }
        self.$socket.sendProcessByName(header, input, function(queryData) {
          console.log("pccCallback", queryData)
          if (queryData != null) {
            self.updateCallback(queryData);
          }
        });
      }
    },
    destroyWebView() {
      console.log("self.destroyWebView");
      cordova.exec( null , null, "AppPlugin" , "destroyWebView", null);      //본인인증 웹뷰 삭제
    },
    changePhone() {
      //본인인증후 핸드폰번호, DI값 서버로 전달하여 핸드폰번호 업데이트
      const self = this;
      // window.removeEventListener('message', self.pccCallback);
      // self.popupId = window.open(process.env.CERT_URL, 'pccPopup', "width=410,height=635");
      // window.addEventListener('message', self.pccCallback);
      self.$EventBus.$emit('downChart');
      cordova.exec(null,null,"AppPlugin","loadWebView",[0,0,1,1,'',process.env.CERT_URL]);
    }, 
    getData() {
      const self = this;
      let header = { trName: 'at006' }
      let input = {
        InBlock1: [{
          enc_user_id: self.getUserInfo.user_id
        }]
      }
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("getData_at006:", queryData)
        if (queryData != null) {
          self.callback(queryData);
        }
      });
    },
    callback(queryData) {
      const self = this;
      if (queryData.queryObj) {
        let output = queryData.queryObj.OutBlock1[0];
        if (output != null) {
          if (output.rslt_cls == '1') {
            self.data = output;
            self.data.sms_gb = output.sms_gb == "Y" ? true : false;
            self.data.auto_gb = output.auto_gb == "Y" ? true : false;       

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
    askLogout() {
      const self = this;
     
      self.$confirm("로그아웃하시겠습니까?" , {
        confirmButtonText: self.$t("common.confirm"),
        cancelButtonText: self.$t("common.cancel"),
        center: true,
      }).then(() => {
        self.$EventBus.$emit("goLogout");        
      });     
    },
  
    reloadInfo() {
      const self = this;
      self.getData();
    }
  },
  mounted(){    
    const self = this;
    if (self.isSocketConnected) {    
     // self.data = self.$route.params       
      self.getData();
    } else {
      self.$EventBus.$on('socketConnected', self.getData);
    }  
    window.addEventListener('pccCallback', self.pccCallback);
    window.document.addEventListener("backbutton", self.destroyWebView, false);
  },
  created() {
    const self = this;
    self.$EventBus.$emit("setLogo", {
      type: "",
      text: "프로필정보"
    }); // 회원정보수정
    self.$EventBus.$on("changeLangType", self.changeLangType);
    self.$EventBus.$on('reloadInfo', self.reloadInfo);
    self.$EventBus.$emit("setMenuIndex", "3-2");
  },
  beforeDestroy() {
    const self = this;
    self.$EventBus.$off('reloadInfo', self.reloadInfo);
    window.document.removeEventListener("backbutton", self.destroyWebView);
 //   self.$EventBus.$off("changeLangType", self.changeLangType);
  },
  destroyed(){
	window.removeEventListener('pccCallback', this.pccCallback);
  }
}

</script>


<style>
  .image {
    border-radius: 100%;
    width: 50%;
    display: block;
  }

  .profile-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .profile-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .profile-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .profile {
    width: 178px;
    height: 178px;
    display: block;
  }

</style>
