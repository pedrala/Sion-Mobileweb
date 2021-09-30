<!--
M/W : ID, PW 찾기
-->
<template>
	<!-- content -->
	<div class="content membership">
    <md-tabs md-alignment="fixed"  @md-changed="changeHandler" ref="tabs">
      <md-tab id="tab-home" :md-label="$t('idpwfind.a007')" exact>
        <!-- 아이디 찾기 휴대폰 인증 -->
        <div class="id-pw-wrap" v-show="findIdVisible">
          <p v-html="$t('idpwfind.a002')">
            <!--아이디가 기억나지 않으시나요?<br>
            본인인증을 통해 아이디를 확인하실 수 있습니다.-->
          </p>
          <!-- certifi -->
          <el-button class="certifi" @click="goFindIdCert">
            <i class="icon-phone"></i>
            <strong class="name">{{ $t("idpwfind.a003") }}<!-- 휴대폰 본인인증--></strong>
          </el-button>
          <!-- //certifi -->
          <!-- bullet -->
          <ul class="bullet bullet-type01 bullet-color02">
            <li v-html="$t('idpwfind.a004')"><!--
									본인인증을 위해 입력한 정보는 본인인증 용도 외 다른 용도로<br>
									이용되지 않습니다.-->
            </li>
            <li v-html="$t('idpwfind.a005')">
              <!--휴대폰 본인인증으로 아이디 또는 비밀번호를 찾으실 수 없으시면<br>
              <span class="color02">고객센터 (070-4943-9774)</span>로 연락해주세요.-->
            </li>
          </ul>
          <!-- //bullet -->
        </div>
        <!-- //아이디 찾기 휴대폰 인증 -->

        <!-- 아이디 확인 -->
        <div class="id-pw-wrap" v-show="resultFindIdVisible" style="display: none;">
          <!-- section -->
          <div class="section">
            <p>{{ $t("idpwfind.a006") }}<!-- 입력하신 정보로 가입된 아이디 정보를 확인해주세요.--></p>
            <!-- certifi -->
            <div class="certifi">
              <strong class="name">{{resultFindId}}</strong>
            </div>
            <!-- //certifi -->
            <!-- btns -->
            <div class="btns">
              <el-button class="button button-bg03 block" @click="showLogin">{{ $t("login.a004") }}<!--로그인--></el-button>
            </div>
            <!-- //btns -->
          </div>
          <!-- //section -->
        </div>
        <!-- //아이디 확인 -->
      </md-tab>

      <md-tab id="tab-pages" :md-label="$t('idpwfind.b001')">
        <!-- 비밀번호 찾기 휴대폰 인증 -->
        <div class="id-pw-wrap" v-show="visiblePwFind">
          <p v-html="$t('idpwfind.b002')">
            <!--비밀번호가 기억나지 않으시나요?<br>
            휴대폰 본인인증 후 비밀번호를 다시 설정할 수 있습니다.-->
          </p>
          <!-- form -->
          <div class="form">
            <div class="item">
              <label class="name">{{ $t("login.a002") }}<!-- 아이디--></label>
              <el-input :title="$t('login.a002')" :placeholder="$t('registration.f002')" v-model="user_id" class="input" clearable></el-input>
            </div>
          </div>
          <!-- //form -->
          <!-- certifi -->
          <el-button class="certifi" @click="goResetPwCert">
            <i class="icon-phone"></i>
            <strong class="name">{{ $t("idpwfind.a003") }}<!--휴대폰 본인인증--></strong>
          </el-button>
          <!-- //certifi -->
          <!-- bullet -->
          <ul class="bullet bullet-type01">
            <li v-html="$t('idpwfind.a004')"><!--
									본인인증을 위해 입력한 정보는 본인인증 용도 외 다른 용도로<br>
									이용되지 않습니다.-->
            </li>
            <li v-html="$t('idpwfind.a005')">
              <!--휴대폰 본인인증으로 아이디 또는 비밀번호를 찾으실 수 없으시면<br>
              <span class="color02">고객센터 (070-4943-9774)</span>로 연락해주세요.-->
            </li>
          </ul>
          <!-- //bullet -->
        </div>
        <!-- //비밀번호 찾기 휴대폰 인증 -->

        <!-- 비밀번호 찾기 비밀번호 재설정 -->
        <div class="id-pw-wrap" style="display: none;" v-show="visiblePwReset">
          <!-- form -->
          <div class="form">
            <!-- heading -->
            <div class="heading depth01">
              <h2 class="title">{{ $t("idpwfind.b003") }}<!--비밀번호 재설정--></h2>
            </div>
            <!-- //heading -->
            <!-- item -->
            <div class="item">
              <span class="name">{{ $t("idpwfind.b004") }}<!--비밀번호 입력--></span>
              <el-input type="password" :title="$t('login.a003')" :placeholder="$t('registration.f003')" v-model="user_pw" class="input" maxlength="16" clearable></el-input>
            </div>
            <!-- //item -->
            <!-- item -->
            <div class="item">
              <span class="name">{{ $t("idpwfind.b005") }}<!--비밀번호 확인--></span>
              <el-input type="password" :title="$t('idpwfind.b005')" :placeholder="$t('mypage.d100.a007')" v-model="user_pw2" class="input" maxlength="16" clearable></el-input>
            </div>
            <!-- //item -->
          </div>
          <!-- //form -->
          <!-- btns -->
          <div class="btns">
            <el-button class="button button-bg03 block" @click="clickResetPwConfirm">{{ $t('common.confirm') }}<!--확인--></el-button>
          </div>
          <!-- //btns -->
          <!-- bullet -->
          <ul class="bullet bullet-type01 bullet-color02 color04">
            <li>{{ $t("idpwfind.b006") }}<!--숫자, 영문자, 특수문자 조합으로 8~16자리 입력해주세요.--></li>
            <li v-html="$t('idpwfind.b007')">
              <!--동일한 숫자, 문자 또는 연속 숫자 3글자 이상의 비밀번호를 입력<br>
              하실 수 없습니다.-->
            </li>
          </ul>
          <!-- //bullet -->
        </div>
        <!-- //비밀번호 찾기 비밀번호 재설정 -->
      </md-tab>

    </md-tabs>
	</div>
	<!-- //content -->
</template>

<script>
	import {
		mapGetters
	} from "vuex";

	export default {
		components: {

		},
		data() {
			const validatePass1 = (rule, value, callback) => {
				let len = value.length;
				let validate = false
				for (let i = 0; i < len; i++) {
					if (i + 2 < len) {
						if (value.charCodeAt(i) + 1 == value.charCodeAt(i + 1) && value.charCodeAt(i + 1) + 1 == value.charCodeAt(i + 2)) validate = true;
						if (value.charCodeAt(i) == value.charCodeAt(i + 1) && value.charCodeAt(i + 1) == value.charCodeAt(i + 2)) validate = true;
					}
				}
				// validate ? callback(new Error(this.$t('signup.c008'))) : callback()

				const re1 = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&().=_+])[A-Za-z\d@$!%*#?&().=_+]{8,16}$/

				if (value === '') {
					callback(new Error('비밀번호를 입력하세요.'))
				} else if (validate) {
					callback(new Error('3자 이상 연속문자, 중복문자는 사용할 수 없습니다.(ex. 123, 333, aaa, abc)'))
				} else if (!re1.test(value)) {
					callback(new Error('영문, 숫자, 특수문자 포함 8~16자리로 입력하세요.'))
				} else {
					callback()
				}
			}
			const validatePass2 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('비밀번호를 입력하세요.'))
				} else if (value !== this.user_pw) {
					callback(new Error('비밀번호가 일치하지 않습니다.'))
				} else {
					callback()
				}
			}
			const validateMail = (rule, value, callback) => {
				const re1 = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

				if (value === '') {
					callback(new Error(this.$t('signup.d001')))
				} else if (!re1.test(value)) {
					callback(new Error(this.$t('signup.d002')))
				} else {
					callback()
				}
			}
			return {
				visibleIdpwFind: true,
				findIdVisible: true,
				resultFindIdVisible: false,
				findPwVisible: true,
				visiblePwFind: true,
        visiblePwReset: false,

        popupId: null,

				user_id: '',
				user_pw_now: '',
				user_pw: '',
				user_pw2: '',
				user_nm: '',
				user_phone: '',
				nick_nm: '',
				resultFindId: '',
				di: '',
				tabIndex : '0',
				currenttab: "",

				rule: {
					user_mail: [
						// { required: true, message: this.$t('signup.d001'), trigger: 'blur' },
						// { required: true, pattern:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ , message: this.$t('signup.d002'), trigger: 'blur' }
						{
							validator: validateMail,
							trigger: 'blur'
						}
					],
					iput_pass: [
						// { required: true, message: this.$t('signup.d006'), trigger: 'blur' },
						// { required: true, pattern:/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&().=_+])[A-Za-z\d@$!%*#?&().=_+]{8,16}$/ , message: this.$t('signup.d007'), trigger: 'blur' },
						{
							validator: validatePass1,
							trigger: 'blur'
						}
					],
					iput_pass2: [{
						validator: validatePass2,
						trigger: ['change', 'blur']
					}],
					// use_terms: [
					// 	{ type: 'enum', enum: ['true'], required: true, message: this.$t('signup.d011'), transform: value => value.toString(), trigger: 'change' }
					// ],
					// prv_info_proc: [
					// 	{ type: 'enum', enum: ['true'], required: true, message: this.$t('signup.d012'), transform: value => value.toString(), trigger: 'change' }
					// ]
				},
			};
		},
		computed: {
			...mapGetters(['isLoggedIn'])
    },
    watch: {
      isLoggedIn(val, old) {
        if (val) {
          const self = this;
          self.$router.push({ path: '/home/interest' });
        }
      }
    },
		methods: {
			handleClick (tab,event){
				let self =this
				if(tab.index === '0'){
					self.tabIndex = '0';
				}else if(tab.index === '1'){
					self.tabIndex = '1';
				}
			},
			changeHandler (activeTab) {
				let self = this;
				self.currenttab = activeTab;
			//	console.log("currenttab:"+self.currenttab )

			},
			//로그인 화면으로 이동
			showLogin() {
				let self = this;
				self.$store.commit("setNeedLogin", true);

			},
			//아이디 찾기 본인인증
			goFindIdCert() {
				let self = this;
				// self.popupId = window.open(process.env.CERT_URL,'pccPopup', "width=410,height=635");
				cordova.exec(null,null,"AppPlugin","loadWebView",[0,0,1,1,'',process.env.CERT_URL]);
				// window.addEventListener('message', self.pccCallback);
			},
			goFindId() {
				let self = this;

				let header = {
					trName: 'at004'
				}

				let input = {
					InBlock1: [{
						cert_key: self.di
					}]
				}

				self.$socket.sendProcessByName(header, input, function(queryData) {
					console.log(queryData);
					if (queryData != null) {
						if (queryData.queryObj) {
							// alert(queryData.queryObj.OutBlock1[0].rslt_data);
							self.resultFindId = queryData.queryObj.OutBlock1[0].rslt_data;
							if(self.currenttab == '1') { //비밀번호 찾기의 경우 실행
								if(self.resultFindId == self.user_id) {
									self.goResetPw();
								} else {
									self.$alert(self.$t('login.a018'), '', {
										confirmButtonText: self.$t('common.confirm')//'확인'
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

				self.findIdVisible = false;
				self.resultFindIdVisible = true;
				self.visibleIdpwFind = true;
				self.findPwVisible = true;
			},
			goResetPwCert() {
				const self = this;

				if (self.user_id == '') {
					var sTitle = self.$t('login.a010'); //아이디를 입력해주세요
					self.$alert(sTitle, '', {
						confirmButtonText: self.$t('common.confirm')//'확인'
					});
					return;
				}

				if (self.user_id.length < 6) {
					var sTitle = self.$t('login.a018'); //아이디를 다시 확인해주세요
					self.$alert(sTitle, '', {
						confirmButtonText: self.$t('common.confirm')//'확인'
					});
					return;
				}

				// self.popupId = window.open(process.env.CERT_URL,'pccPopup', "width=410,height=635");
				cordova.exec(null,null,"AppPlugin","loadWebView",[0,0,1,1,'',process.env.CERT_URL]);
				// window.addEventListener('message', self.pccCallback);

			},
			goResetPw() {
				const self = this;

				let header = {
					trName: 'at097'
				}

				let input = {
					InBlock1: [{
						user_id: self.user_id,
						cert_key: self.di,
					}]
				}
				console.log("goResetPw:" + JSON.stringify(input));
				self.$socket.sendProcessByName(header, input, function(queryData) {
					console.log(queryData);
					if (queryData != null) {
						if (queryData.queryObj) {
							// alert(queryData.queryObj.OutBlock1[0].rslt_cls);
							self.visibleIdpwFind = false;
							self.visiblePwFind = false;
							self.visiblePwReset = true;
						} else {
							self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
                confirmButtonText: self.$t("common.confirm"),
              });
						}
					}
				});

			},

			//비밀번호 재설정
			clickResetPwConfirm() {
				const self = this;
				if(self.validatePassword()) {
					let header = {
						trName: 'at007'
					}

					var gbVal = '0';
					var inputVal = self.user_pw2;
					// var inputNowPw = self.user_pw_now;

					// if (self.user_pw == '' || self.user_pw2 == '') {
					// 	alert("비밀번호를 입력해주세요");
					// 	return;
					// }

					// if (self.user_pw.length < 8 || self.user_pw2.length < 8) {
					// 	alert("비밀번호는 숫자, 영문자 특수문자 조합으로 8~16자리 입력해주세요");
					// 	return;
					// }

					// if (self.user_pw != self.user_pw2) {
					// 	alert("비밀번호가 일치하지 않습니다");
					// 	return;
					// }

					//alert("동일한 숫자/문자/ 또는 연속된 숫자 3글자 이상의 비밀번호를 입력할 수 없습니다");

					let input = {
						InBlock1: [{
							enc_user_id: '', //DI값으로 처리
							update_gb: gbVal,
							check_data: self.di, //update_gb값이 '0'(인증)일 경우 DI 값 설정,  '1'일 경우 현재 비번
							update_data: inputVal
						}]
					}

					self.$socket.sendProcessByName(header, input, function(queryData) {
						console.log(queryData);
						if (queryData != null) {
							if (queryData.queryObj) {
								// alert(queryData.queryObj.OutBlock1[0].rslt_msg);
								// 비밀번호 변경이 완료되었습니다
								self.$alert(self.$t('mypage.d100.a011'), '', {
									confirmButtonText: self.$t('common.confirm'),
									callback: function() {
										self.$router.push({ name:'Main' });
										self.showLogin();
									}
								});
							} else {
								self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
                  confirmButtonText: self.$t("common.confirm"),
                });
							}
						}
					});
				}
			},
			validatePassword() {
				const self = this;

				if (self.user_pw == '') {
					var sTitle = self.$t('registration.f003'); //비밀번호를 입력해주세요
					self.$alert(sTitle, '', {
						confirmButtonText: self.$t('common.confirm')//'확인'
					});
				} else if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&().=_+])[A-Za-z\d@$!%*#?&().=_+]{8,16}$/.test(self.user_pw2)) {
					var sTitle = self.$t('mypage.d100.a015'); //비밀번호는 영문/숫자/특수문자 조합 8~16자리를 입력해주세요.<br>특수문자는 @$!%*#?&().=_+를 허용합니다.
					self.$alert(sTitle, '', {
            dangerouslyUseHTMLString: true,
						confirmButtonText: self.$t('common.confirm')//'확인'
					});
				} else if (/(\w)\1\1/.test(self.user_pw2)) {
					var sTitle = self.$t('mypage.d100.a009'); //동일한 숫자/문자 또는 연속된 숫자 3글자 이상의 비밀번호를 입력할 수 없습니다
					self.$alert(sTitle, '', {
						confirmButtonText: self.$t('common.confirm')//'확인'
					});
				} else if (/(012)|(123)|(234)|(345)|(456)|(567)|(678)|(789)|(890)/.test(self.user_pw2)) {
					var sTitle = self.$t('mypage.d100.a009'); //동일한 숫자/문자 또는 연속된 숫자 3글자 이상의 비밀번호를 입력할 수 없습니다
					self.$alert(sTitle, '', {
						confirmButtonText: self.$t('common.confirm')//'확인'
					});
				} else if (self.user_pw2 == '') {
					var sTitle = self.$t('registration.f007'); //비밀번호 확인을 입력해주세요
					self.$alert(sTitle, '', {
						confirmButtonText: self.$t('common.confirm')//'확인'
					});
				} else if (self.user_pw != self.user_pw2) {
					var sTitle = self.$t('registration.f008'); //비밀번호가 일치하지 않습니다
					self.$alert(sTitle, '', {
						confirmButtonText: self.$t('common.confirm')//'확인'
					});
				} else {
					return true;
				}
				return false;
			},
			pccCallback(e) {
				let self = this;
				// window.removeEventListener('message', self.pccCallback);
				if (self.popupId) {
					self.popupId.close();
				}
				cordova.exec( null , null, "AppPlugin" , "destroyWebView", null);      //본인인증 웹뷰 삭제
				// let user = self.$store.state.user
				console.log('pccCallback_di', e.detail.di);
				console.log('pccCallback_user_brth_day', e.detail.birYMD);
				console.log('pccCallback_외국인구분', e.detail.fgnGbn);
				console.log('pccCallback_phone', e.detail.cellNo);
				console.log('pccCallback_username', decodeURI(e.detail.name));
				self.di = e.detail.di;

				//회원가입 필드 채움
				// self.user_nm = decodeURI(e.data.name);
				// self.user_phone = e.data.cellNo;

				//만 19세 미만은 회원가입 불가
				if(self.calcAge(e.detail.birYMD) < 18) {
					var sTitle = self.$t('idpwfind.c001'); //만 19세 미만은 사용이 불가합니다
					self.$alert(sTitle, '', {
						confirmButtonText: self.$t('common.confirm'),//'확인'
						callback: function() {
							self.$router.push({ name:'Main' });
						}
					});
					return;
				}

				if(self.di != '') {
					if(self.currenttab == 'tab-pages')
						self.goResetPw(); //비밀번호 찾기시 가입된 아이디를 불러와, 입력된 아이디와 비교하여 적합성 체크를 한후
						                 //일치할 경우 비번 찾기를 실행한다.
					else
						self.goFindId();
				}
			},
			calcAge(birth) {
				var date = new Date();
				var year = date.getFullYear();
				var month = (date.getMonth() + 1);
				var day = date.getDate();
				if (month < 10) month = '0' + month;
				if (day < 10) day = '0' + day;
				var monthDay = month + "" + day;
				birth = birth.replace('-', '').replace('-', '');
				var birthdayy = birth.substr(0, 4);
				var birthdaymd = birth.substr(4, 4);
				var age = monthDay < birthdaymd ? year - birthdayy - 1 : year - birthdayy;

				return age;
			}
		},
		mounted() {
			this.visibleIdpwFind = true;
			this.findIdVisible = true;
			this.resultFindIdVisible = false;
			this.findPwVisible = true;
			this.visiblePwFind = true;
			this.visiblePwReset = false;

			window.addEventListener('pccCallback', this.pccCallback);
		},
		destroyed(){
			window.removeEventListener('pccCallback', this.pccCallback);
		}
	}

</script>
