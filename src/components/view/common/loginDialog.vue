<template>
  <el-dialog :visible.sync="visibleDialog"
    @focus="handleFocus"
    @focusout="handleFocusOut"
    tabindex="0"
    class="sion-login"
    width="100%" top="0"
    :close-on-click-modal="true"
    append-to-body>
    <template slot="title">
      <div v-if="!getUserInfo">
        <div  class="login">
          <h1 class="title">{{ $t('login.a004') }}<!-- 로그인 --></h1>
          <el-input :placeholder="$t('login.a002')" v-model="user_id" class="input input-id" clearable></el-input><!-- 아이디 -->
          <el-input type="password" :placeholder="$t('login.a003')" v-model="user_pw" class="input input-pw" clearable></el-input><!-- 비밀번호 -->
          <div class="foot clear">
            <el-checkbox v-model="isSaveId" class="checkbox">{{ $t('login.a005') }}<!-- 아이디 저장 --></el-checkbox>
            <el-checkbox v-model="isAutoLogin" class="checkbox">{{ $t('login.a019') }}<!-- 로그인 유지 --></el-checkbox>
          </div>
          <el-button @click="goLogin" type="primary" class="button button-bg02 block">{{ $t('menu.a006') }}<!-- 로그인 --></el-button>
          <el-button @click="loginWithKaKaoSdk" class="button button-bg02 block btn-kakao">
          <img :src="require('@/images/kakao-icon.svg')" width="16" />
          카카오계정으로 로그인
          </el-button>
          <div class="etc">
            <el-link @click="goIdpwFind" class="fr text-link">{{ $t('login.a006') }}<!-- 아이디/비밀번호 찾기 -->
            </el-link>
            <el-link @click="goRegistration" class="underline color06 member right">{{ $t('menu.a007') }}<!-- 회원가입 -->
            </el-link>
          </div>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import crypto from 'crypto';
import { sendApi } from '@/api';

export default {

  computed: {
    ...mapGetters(['getUserInfo', 'getNeedLogin', 'getLoginCallbackUrl', 'isVertical']),
  },
  data() {
    return {
      isShowLogin: false, //로그인 여부

      login_gb: '', //0: 카카오톡로그인, 1: 일반로그인
      kakao_id: '',
      user_id: '',
      user_pw: '',
      activeIndex: '0',
      langs: [{
        locale: 'ko',
        label: 'KOR'
      }, {
        locale: 'en',
        label: 'ENG'
      }],

	  visibleDialog: false,
      langType: '',
      isSaveId: false,
      isAutoLogin: false,
    }
  },

  watch: {
    langType(val, old) {
      console.log("langType", val);

      localStorage.setItem("SIGNALMAKER_langType", val);

      const self = this;
      self.$i18n.locale = val;
      if (self.getUserInfo) {
        self.setLangType();
      } else {
        self.$EventBus.$emit("changeLangType");
      }
    },
    getNeedLogin(val, old) {
      const self = this;
      if (val) {
        self.needLogin();
        self.$store.commit("setNeedLogin", false);
      }
    },
    visibleDialog: function () {
      const self = this;
      if(self.visibleDialog == true)
      {
        self.$EventBus.$emit('downChart');
      }
      else
      {
        self.$EventBus.$emit('upChart');
      }
    }
  },

  methods:{
		handleFocus() {
			const self = this;
			self.visibleDialog = true
			self.$store.commit("setNeedLogin", true);
		},
		handleFocusOut() {
			const self = this;
			self.visibleDialog = false
			self.$store.commit("setNeedLogin", false);
		},
		loginWithKaKaoSdk() {
			const self = this;
			window.KakaoCordovaSDK.login(  0,
				function(res) {
					console.log("kakao info success", JSON.stringify(res));
					self.login_gb = '0';
					self.kakao_id = res.id;
					self.login();

				}, function(error) {
					// alert("loginWithKaKaoSdk fail...:"+JSON.stringify(error));
					//앱 등록 정보 삭제
					window.KakaoCordovaSDK.unlinkApp(() => {
					//do your unregister proccess for your app
						console.log("loginDialog success unlinkApp ~~~~~~");
					});
					console.log(JSON.stringify(error));
				}
			);
		},
		loginWithKaKao() {
			const self = this;
			console.log("loginWithKaKao");
			Kakao.Auth.login({
				scope : 'account_email, profile',
				success: obj => {
				console.log("kakao login success", obj);
				Kakao.API.request({
					url: '/v2/user/me',
					success: res => {
					console.log("kakao info success", res);
					self.login_gb = '0';
					self.kakao_id = res.id;
					self.login();
					},
					fail: err => {
					console.log("kakao info fail", err);
					self.$alert(err, '', {
						confirmButtonText: self.$t("common.confirm"),
					});
					}
				})
				},
				fail: err => {
				console.log("kakao login fail", err);
				self.$alert(err, '', {
					confirmButtonText: self.$t("common.confirm"),
					callback: () => {
					self.$alert(location.href, '', {
						confirmButtonText: self.$t("common.confirm"),
					});
					}
				});
				}
			});
		},
		needLogin() {
			const self = this;
			self.$store.commit("setNeedLogin", false);
			self.showMenu();
			self.showNeedLogin();
		},
		showMenu() {
			console.log("showMenu");
			const self = this;
			if (self.visibleDialog) {
				return;
			}

			self.isShowLogin = false;
			setTimeout(function() {
				self.visibleDialog = true;
				self.$store.commit("setNeedLogin", true);

			}, 100)

		},
		showNeedLogin() {
			const self = this;
			if (self.isShowLogin) {
				return;
			}
			let encStr = self.$cookies.get("VCSUI");
			if (encStr && encStr != '') {
				try {
				var decipher = crypto.createDecipheriv('aes-256-cbc', "signalmaker2019!signalmaker2019!", '1234567890abcdef');
				var dec = decipher.update(encStr, "binary", "utf-8");
				dec += decipher.final("utf-8");
				self.user_id = dec;
				} catch (err) {
				console.log(err);
				self.user_id = "";
				}
			}
			if (self.user_id && self.user_id != "") {
				self.isSaveId = true;
			}
			self.isShowLogin = true;
		},
		showLogin() {
			const self = this;
			self.$store.commit("setLoginCallbackUrl", "");
			self.showNeedLogin();
		},
		login() {
			console.log("login...first");
			const self = this;
			let header = { trName: 'at331' }
			let input = {
				InBlock1: [{
					login_gb: self.login_gb,
					user_id: self.login_gb=='0'?self.kakao_id:self.user_id,
					user_pw: self.user_pw,
					lang_pack: self.$i18n.locale
				}]
			}
			self.$socket.sendProcessByName(header, input, function(queryData) {
				console.log("login...", queryData);
				if (queryData != null) {
					let output = queryData.queryObj.OutBlock1[0];
					if (output.rslt_cls == '1') {
									let token = {
										user_id: output.EncUserId,
										user_nnm: output.user_nnm,
										user_nm: output.user_nm,
										sess_id: output.SesnId,
										sess_expires: self.isAutoLogin?86400000:0,
										profile_image_url: output.profile_image_url,
										login_gb: self.login_gb,
									};
									sendApi('/user/login', token, function() {
										self.$store.commit("SET_USERINFO", token);
										if (self.getLoginCallbackUrl != '') {
											self.$router.push({ path: self.getLoginCallbackUrl });
											self.$store.commit("setLoginCallbackUrl", "");
										} else {
											self.$EventBus.$emit('login');
											//현재 푸터메뉴가 홈이면 관심화면으로 이동
											if(self.$router.history.current.matched[0].path == "/home") {
												self.$router.push('/home/interest');
											}								
										}
									});

							if (self.login_gb == '1') {
								if (self.isSaveId) {
									try {
									var cipher = crypto.createCipheriv('aes-256-cbc', "signalmaker2019!signalmaker2019!", '1234567890abcdef');
									var enc = cipher.update(self.user_id, "utf8", "binary");
									enc += cipher.final("binary");
									self.$cookies.set("VCSUI", enc, Infinity);
									} catch (err) {
									console.log(err);
									}
								} else {
									self.$cookies.set("VCSUI", '', Infinity);
								}
							}

							self.user_id = "";
							self.user_pw = "";
							self.visibleDialog = false;
							//self.$store.commit("setVisibleLoginPopup", false);
							self.isSaveId = false;

							//device 일 경우 phone에서 uuid를 얻어오는 부분 - push
							//alert("===알림설정 푸쉬키 등록===");
							// alert("isSystemWebview:"+afc.isSystemWebview);
							// alert("isAndDevice:"+(afc.isAndroid && afc.andVer<1000));
							// alert("isIosDevice:"+(afc.isIos && afc.iosVer<1000));
							// if (afc.isDevice) {
              if (typeof cordova !== 'undefined') {
                PushManager.onTokenRefresh(); //최초 토큰 생성 호출
              }

							self.timer = setTimeout(() => {
                //
                if (typeof cordova !== 'undefined') {
                  PushManager.getPushToken(function(resp) {
                    console.log("### token :", resp.TOKEN);

                    const tmpPayload = {
                      enc_user_id        : output.EncUserId,
                      device_id : resp.TOKEN
                    }

                    // 모바일 앱 일경우
                    if (tmpPayload['device_id'] == '' || tmpPayload['device_id'] == undefined) {
                      self.$message("디바이스 토큰 정보가 없습니다.")
                    } else {
                      self.reqNotiPush(tmpPayload);
                    }
                  });
                }
							}, 1000);
							// }
							//device 일 경우 phone에서 uuid를 얻어오는 부분 end
						} else {
							//kakao logout
							try {
								window.KakaoCordovaSDK.logout(
								function(response) {
									console.log("loginDialog kakao logout success", JSON.stringify(response));
								}, function(error) {
									// alert("fail...");
									console.log("kakao logout" , JSON.stringify(error));
								}
								);
							} catch(e) {
								console.log(e);
							}
							//
							self.$EventBus.$emit('downChart');
							self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
								confirmButtonText: self.$t("common.confirm"),
								dangerouslyUseHTMLString: true,
								callback: action => {
									if(!self.visibleDialog) {
										self.$EventBus.$emit('upChart');
									}
								}
							});
						}
						}
					});
				},

		reqNotiPush(data) {
			const self = this;
			let header = { trName: 'at325' };
			let input = {
				InBlock1: [{
					enc_user_id: data.enc_user_id,
					device_id: data.device_id,
				}]
			}
			self.$socket.sendProcessByName(header, input, function(queryData) {
				if (queryData) {
					let output = queryData.queryObj.OutBlock1[0];
					if (output != null) {
						if (output.rslt_cls == '1') {
							console.log('push 등록 (at325) 처리 성공 !!!')
							// self.$message('push 등록 (at325) 처리 성공 !!!');
						} else {
							console.log(output.rslt_cls)
							self.$message(output.rslt_cls);
						}
					}

					if (!queryData) {
						console.log('push 등록 (at325) 처리 실패')
						/** error 처리 S **/
						let errorData = window.sessionStorage.getItem('lastErrorData')
						if (errorData !== null) {
							errorData = JSON.parse(errorData)
							if (errorData.trName === 'at325') // alert(errorData.errMsg)
							reject(errorData)
						}
						/** error 처리 E **/
						return
					}
				}
			});
		},

		goLogin() {
			const self = this;
			if (self.user_id == '') {
				// 아이디 입력해주세요
				self.$alert(self.$t("login.a010"), '', {
				confirmButtonText: self.$t("common.confirm"),
				});
				return;
			}
			if (self.user_pw == '') {
				// 패스워드 입력해주세요
				self.$alert(self.$t("login.a011"), '', {
				confirmButtonText: self.$t("common.confirm"),
				});
				return;
			}
			self.login_gb = '1';
			self.login();
		},

		goIdpwFind() {
			const self = this;
			self.visibleDialog = false;
			self.$store.commit("setNeedLogin", false);
			self.$router.push('/idpwFind');
		},
		goRegistration() {
			const self = this;
			self.visibleDialog = false;
			self.$store.commit("setNeedLogin", false);
			self.$router.push('/registration');
		},

		setMenuIndex(index) {
			const self = this;
			if (index.length > 1) {
				self.activeIndex = index.substring(0, 1);
			} else {
				if (index == '0') {
				self.activeIndex = '0';
				} else {
				self.activeIndex = index;
				}
			}
			//console.log("activeIndex", self.activeIndex);
		},
		back() {
			const self = this;
			self.visibleDialog = false
			self.$store.commit("setNeedLogin", false);
		}

	},
	mounted() {
		const self = this;
	},
	created() {
		const self = this;

		self.$EventBus.$on("showLogin", self.showLogin);
		self.$EventBus.$on("setMenuIndex", self.setMenuIndex);
		self.$EventBus.$on("setLoginWithKaKaoSdk", self.loginWithKaKaoSdk);

		//https://jessarcher.com/blog/closing-modals-with-the-back-button-in-a-vue-spa/
		//로긴창 띄운 상태에서 백버튼 클릭시 로긴창 닫고 이동은 하지 않음
		const backButtonRouteGuard = self.$router.beforeEach((to, from, next) => {

			if (self.visibleDialog == true) {
			/* Blocking back button in menu route */
			next(false);
			// Go to the previous step, or close the modal
			self.back()
			} else {
			/* allowing all other routes*/
			next(true);
			}
		});

		self.$once('hook:destroyed', () => {
			// This will be called when the component is destroyed.
      		// It has access to anything defined in the scope of our "created" method.
			backButtonRouteGuard();
		});

	},
	beforeDestroy() {
		const self = this;
		self.$EventBus.$off("showLogin", self.showLogin);
		self.$EventBus.$off('setMenuIndex', self.setMenuIndex);
		self.$EventBus.$off('setLoginWithKaKaoSdk', self.loginWithKaKaoSdk);
	}
}
</script>
