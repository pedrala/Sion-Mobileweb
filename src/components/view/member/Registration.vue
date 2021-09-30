<template>
	<div class="content membership">
    <div class="membership-box" v-show="choiceJoinVisible">
      <div class="register-step01">
        <p class="msg01">소셜 아이디사용</p>
        <div class="btns">
          <el-button class="button btn-kakao block" @click="goKakaoJoinSdk" >
            <img :src="require('@/images/kakao-icon.svg')" width="16" />
            카카오 계정으로 회원가입
          </el-button>
        </div>
        <div class="join-or">
          <span>OR</span>
        </div>
        <p class="msg01">시온계정으로 신규 가입</p>
        <div class="btns">
          <el-button class="button button-bg03 block" @click="changeStep(2)" >
            시온 회원가입
          </el-button>
        </div>
      </div>
		</div>

		<div class="membership-box" v-show="confirmJoinVisible">
			<el-tabs v-model="activeName" stretch @tab-click="handleClick">
				<el-tab-pane :label="$t('registration.a002')" name="korean">
          <div class="register-step02">
            <p class="text alignC">
              {{ $t("registration.a004") }}<!-- 시온서비스 회원 가입을 환영합니다.--><br>
              <span class="color02">{{ $t("registration.a004-2") }}<!-- (만 19세 미만 가입불가)--></span>
            </p>
            <div class="btns">
              <el-checkbox-button v-model="showCheckAll" class="checkbox-button" @change="handleCheckAllChange(checkAll)">{{ $t("registration.a004-1") }}<!--전체 동의 (선택동의 포함)--></el-checkbox-button>
            </div>
            <p class="text-etc color04">
              <span v-html="$t('registration.a005')"></span>
              <!--회원가입을 위해 아래 이용약관 및 개인정보 수집 및 이용에 대한<br>안내를 읽고 동의해 주세요.-->
            </p>
            <div class="heading depth01">
              <h2 class="title">{{ $t("registration.a006") }}<!--이용동의--></h2>
            </div>
            <div class="terms-list">
              <ul>
                <li>
                  <input type="checkbox" name="checkedItems1" id="checkedItems1" class="checkbox">
                  <label for="checkedItems1" class="chk-label"> {{ $t('registration.a008') }}</label>
                  <!-- <el-checkbox :title="$t('registration.a008')" class="checkbox" v-model="checkedItems[0].checked" required>{{ $t("registration.a008") }}</el-checkbox> -->
                  <el-button class="button button-text" @click="showTermsCondition('1')">{{ $t("registration.a007") }}<!--내용보기--><i class="icon-arrow01"></i></el-button>
                </li>
                <li>
                  <input type="checkbox" name="checkedItems2" id="checkedItems2" class="checkbox">
                  <label for="checkedItems2" class="chk-label"> {{ $t('registration.a010') }}</label>
                  <!-- <el-checkbox :title="$t('registration.a010')" class="checkbox" v-model="checkedItems[1].checked" required>{{ $t("registration.a010") }}</el-checkbox> -->
                  <el-button class="button button-text" @click="showTermsCondition('4')">{{ $t("registration.a007") }}<!--내용보기--><i class="icon-arrow01"></i></el-button>
                </li>
                <li>
                  <input type="checkbox" name="checkedItems3" id="checkedItems3" class="checkbox">
                  <label for="checkedItems3" class="chk-label"> {{ $t('registration.a011') }}</label>
                  <!-- <el-checkbox :title="$t('registration.a011')" class="checkbox" v-model="checkedItems[2].checked" required>{{ $t("registration.a011") }}</el-checkbox> -->
                  <el-button class="button button-text" @click="showTermsCondition('2')">{{ $t("registration.a007") }}<!--내용보기--><i class="icon-arrow01"></i></el-button>
                </li>
                <li>
                  <input type="checkbox" name="checkedItems4" id="checkedItems4" class="checkbox">
                  <label for="checkedItems4" class="chk-label"> {{ $t('registration.a012') }}</label>
                  <!-- <el-checkbox :title="$t('registration.a012')" class="checkbox" v-model="checkedItems[3].checked">{{ $t("registration.a012") }}</el-checkbox> -->
                </li>
              </ul>
              <p class="foot-text" v-html="$t('registration.a014m')"><!--선택항목 수집 &middot; 이용에 대한 동의를 거부하시더라도 회원가입이 가능합니다.--></p>
              <div class="btns">
                <el-button type="primary" class="block" @click.native.prevent="clicked" >{{ $t("registration.a015") }}<!--휴대폰 본인 확인--></el-button>
              </div>
            </div>
          </div>
				</el-tab-pane>
				<el-tab-pane :label="$t('registration.a003')" name='foreign'><!-- 외국인 --></el-tab-pane>
			</el-tabs>
		</div>

		<div class="membership-box" v-show="newJoinVisible" >
			<div class="section">
				<el-form class="register-form" :class="{'en': $i18n.locale === 'en'}">
					<div class="heading depth01">
						<h2 class="title">{{ $t('registration.c001') }}<!--신규 회원가입--></h2>
					</div>
					<p class="msg01" v-html="$t('registration.c002')"><!--회원가입을 위해 <span class="color02">*필수 입력 정보</span>를 정확하게<br>입력해주세요.--></p>

					<div class="form">
						<div v-if="!chkKakao" class="item">
							<span class="name">{{ $t('login.a002') }}<!--아이디--><strong class="color02">*</strong></span>
							<div class="in-button">
								<el-input type="email" v-model="user_id" :title="$t('login.a002')" :placeholder="$t('registration.c004')" auto-complete="off" maxlength="16" class="input" required></el-input>
								<el-button @click="confirmIdClicked('userid')" class="button">{{ $t('mypage.d101.a005') }}<!--중복확인--></el-button>
							</div>
						</div>
						<div class="item">
							<span class="name">{{ $t('mypage.d006') }}<!-- 필명 --><strong class="color02">*</strong></span>
							<div class="in-button">
								<el-input type="email" v-model="nick_nm" :title="$t('mypage.d006')" :placeholder="$t('registration.c009')" auto-complete="off" maxlength="12" class="input" required></el-input>
								<el-button @click="confirmIdClicked('nick')" class="button">{{ $t('mypage.d101.a005') }}<!--중복확인--></el-button>
							</div>
						</div>
						<div v-if="!chkKakao" class="item">
							<span class="name">{{ $t('mypage.d004') }}<!-- 비밀번호 --><strong class="color02">*</strong></span>
							<el-input type="password" v-model="user_pw" :title="$t('mypage.d004')" :placeholder="$t('registration.c010')" auto-complete="new-password" maxlength="16" class="input" required></el-input>
						</div>
						<div v-if="!chkKakao" class="item">
							<span class="name">{{ $t('mypage.d100.a004') }}<!-- 비밀번호 확인 --><strong class="color02">*</strong></span>
							<el-input type="password" v-model="user_pw2" :title="$t('mypage.d100.a004')" :placeholder="$t('mypage.d100.a007')" auto-complete="new-password" maxlength="16" class="input" required></el-input>
						</div>
						<div class="item">
							<span class="name">{{ $t('mypage.d007') }}<!--이름--><strong class="color02">*</strong></span>
							<el-input type="text" v-model="user_nm" :title="$t('mypage.d007')" auto-complete="off" maxlength="60" class="input" disabled required></el-input>
						</div>
						<div class="item">
							<span class="name">{{ $t('mypage.d008') }}<!--휴대폰번호--><strong class="color02">*</strong></span>
							<el-input type="text" v-model="user_phone" auto-complete="off" maxlength="60" class="input" disabled required></el-input>
						</div>

						<div class="item">
							<span class="name" style="top:26px;">{{ $t('mypage.d009') }}<!--이메일--><strong class="color02">*</strong></span>
							<div class="email">
								<el-input type="email" v-model="user_emailAddress" :title="$t('registration.c006')" :placeholder="$t('registration.c011')" auto-complete="off" maxlength="50" class="input" required></el-input>@
               	<el-input type="email" v-model="user_emailCorp" :title="$t('registration.c006')" auto-complete="off" maxlength="50" class="input" required></el-input>
                <el-select v-model="emailProvider" placeholder="주소선택" @change="changeEmailProviders" class="select" style="width: 25%;float: right;margin-bottom:20px">
                  <el-option v-for="item in emailProviders" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </div>
						</div>

            <div class="btns">
              <el-button v-if="chkKakao" @click.native.prevent="registerKakaoClicked" :loading="registering" class="button button-bg03 block">{{ $t("registration.a001") }}<!-- 회원가입 --></el-button>
              <el-button v-else @click.native.prevent="registerClicked" :loading="registering" class="button button-bg03 block">{{ $t("registration.a001") }}<!-- 회원가입 --></el-button>
            </div>

					</div>
				</el-form>
			</div>
		</div>

    <div class="membership-box" v-show="joinFinishedVisible">
			<div class="section register-complete">
				<div class="msg">
					<i class="icon-msg-success"></i>
					<strong class="title">{{ $t("registration.d001") }}<!--시온 서비스 회원이 되신것을 환영합니다!--></strong>
					<p v-html="$t('registration.d002', [nick_nm])">
						<!--{{nick_nm}} 회원님 환영합니다.<br>
						향후 가입 시 등록한 이메일 주소 또는 정보 변경을 원하시면,<br>
						마이페이지 > 회원정보 에서 수정이 가능합니다.<br>
						<br>
						이제 로그인 후 다양한 서비스를 이용해보세요!-->
					</p>
					<div class="btns">
						<el-button class="button button-bg03 block" @click="showLogin">{{ $t('login.a004') }}<!-- 로그인 --></el-button>
					</div>
				</div>
			</div>
		</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import _lodash from 'lodash'

export default {
	data() {
    return {
      checkAll: false,
      showCheckAll: false,

   //   itemOptionsT: [{"checked":true}, {"checked":true},{"checked":true},{"checked":true}],
   //   itemOptionsF: [{"checked":false}, {"checked":false},{"checked":false},{"checked":false}],
    //  checkedItems: [{"checked":false}, {"checked":false},{"checked":false},{"checked":false}],
    //  agreeVisibles: [{"checked":false}, {"checked":false},{"checked":false},{"checked":false},{"checked":false},{"checked":false}],

      choiceJoinVisible: true,     // 최초진입시
      confirmJoinVisible: false,   // 동의화면
      newJoinVisible: false,       // 신규 회원가입 정보입력
      joinFinishedVisible: false,  // 회원가입 완료



      registering: false,
      activeName: "korean",

      user_id: '',
      user_pw: '',
      user_pw2: '',
      user_nm: '',
      user_phone: '',
      nick_nm: '',
      user_emailAddress: '',
      user_emailCorp:'',

      di: '',
      sex: '',
      birthday: '',
      isIdDoubleChk: false,
      isNickDoubleChk: false,

      popupId: null,
      emailProviders: [{
          value: '',
          label: '직접입력'
        }, {
          value: 'naver.com',
          label: '네이버'
        }, {
          value: 'daum.net',
          label: '다음',
        }, {
          value: 'hanmail.net',
          label: '한메일'
        }, {
          value: 'nate.com',
          label: '네이트'      ,
        }, {
          value: 'yahoo.co.kr',
          label: '야후'
        }, {
          value: 'gmail.com',
          label: '지메일'
        }],
      emailProvider: '',

      chkKakao: false,
      profile_image_url: '',
      kakao_id: '',
    };
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'isSocketConnected'])
  },
  watch: {
    isLoggedIn(val, old) {
      if (val) {
        const self = this;
        self.$router.push({ path: '/home/interest' });
      }
    },
    user_id(val, old) {
      //console.log(val+"===userid==="+old);
      const self = this;
      self.isIdDoubleChk = false
    },
    nick_nm(val, old) {
      //console.log(val+"===nick_nm==="+old);
      const self = this;
      self.isNickDoubleChk = false
    },
    // checkedItems: {
    //   handler: function (val, oldVal) {
    //     var isAllState = true;
    //     for(var item in this.checkedItems) {
    //       if(this.checkedItems[item].checked == false) {
    //         isAllState = false;
    //         break;
    //       }
    //     }

    //     if(isAllState) {
    //       this.showCheckAll = true;
    //       this.checkAll = true;
    //     } else {
    //       this.showCheckAll = false;
    //       this.checkAll = false;
    //     }

    //    }, deep:true
    //   }
  },
  methods: {
    chkKakaoInfo(res) {
      const self = this;
      // 1. 고객정보 확인 (카카오 로그인 AP 사용)
      // 2. 고객정보가 있다 -> 얼랏(이미 가입된 회원)
      // 3. 고객정보가 없다 -> 회원가입 -> 회원가입 완료페이지 이동

      let header = {
        trName: 'at331'
      }
      let input = {
        InBlock1: [{
          login_gb: '0', //0: 카카오, 1: 기존웹회원
          user_id: res.id,
          lang_pack: self.$i18n.locale
        }]
      }
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("goLogin", queryData);
        if (queryData != null) {
          let output = queryData.queryObj.OutBlock1[0];
          if (output.rslt_cls == '1') {
            self.$alert("이미 가입된 회원입니다.", '', {
              confirmButtonText: self.$t("common.confirm"),
            });
          } else {
            self.chkKakao = true;
            self.kakao_id = res.id;
            let email = res.kakao_account.email;
            let tmp = email.split('@');
            if (tmp.length > 1) {
              self.user_emailAddress = tmp[0];
              self.user_emailCorp = tmp[1];
            }
            self.profile_image_url = res.kakao_account.profile.profile_image_url;
            self.nick_nm = res.kakao_account.profile.nickname;
            self.changeStep(2);
          }
        }
      });
    },
    chkKakaoInfoSdk(res) {
      const self = this;
      // 1. 고객정보 확인 (카카오 로그인 AP 사용)
      // 2. 고객정보가 있다 -> 얼랏(이미 가입된 회원)
      // 3. 고객정보가 없다 -> 회원가입 -> 회원가입 완료페이지 이동

      // self.chkKakao = true;
      // self.kakao_id = res.id;
      // let email = res.kakao_account.email;
      // let tmp = email.split('@');
      // if (tmp.length > 1) {
      //   self.user_emailAddress = tmp[0];
      //   self.user_emailCorp = tmp[1];
      // }
      // self.profile_image_url = res.kakao_account.profile.profile_image_url;
      // self.nick_nm = res.kakao_account.profile.nickname;
      // self.changeStep(2);

      let header = {
        trName: 'at331'
      }
      let input = {
        InBlock1: [{
          login_gb: '0', //0: 카카오, 1: 기존웹회원
          user_id: res.id,
          lang_pack: self.$i18n.locale
        }]
      }
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("goLogin", queryData);
        if (queryData != null) {
          let output = queryData.queryObj.OutBlock1[0];
          if (output.rslt_cls == '1') {
            //앱 등록 정보 삭제
            window.KakaoCordovaSDK.unlinkApp(() => {
            //do your unregister proccess for your app
              console.log("loginDialog success unlinkApp ~~~~~~");
            });

            self.$EventBus.$emit('downChart');
            self.$alert("이미 가입된 회원입니다.", '', {
              confirmButtonText: self.$t("common.confirm"),
              callback: action => {
                self.$EventBus.$emit('upChart');
              }
            });
          } else {
            self.chkKakao = true;
            self.kakao_id = res.id;
            let email = res.kakao_account.email;
            let tmp = email.split('@');
            if (tmp.length > 1) {
              self.user_emailAddress = tmp[0];
              self.user_emailCorp = tmp[1];
            }
            self.profile_image_url = res.kakao_account.profile.profile_image_url;
            self.nick_nm = res.kakao_account.profile.nickname;
            self.changeStep(2);
          }
        }
      });
    },
		goKakaoJoinSdk() {
      const self = this;
      console.log("joinWithKaKao");
			window.KakaoCordovaSDK.login(  0,
				function(res) {
					console.log("kakao info success", JSON.stringify(res));
					self.chkKakaoInfoSdk(res);

				}, function(error) {
          console.log(JSON.stringify(error));
          //앱 등록 정보 삭제
					window.KakaoCordovaSDK.unlinkApp(() => {
					//do your unregister proccess for your app
						console.log("loginDialog success unlinkApp ~~~~~~");
          });
          
          self.$EventBus.$emit('downChart');
          self.$alert(err, '', {
            confirmButtonText: self.$t("common.confirm"),
            callback: action => {
              self.$EventBus.$emit('upChart');
            }
          });
				}
			);
		},
    
    changeStep(val) {
      const self = this;
      console.log("regi changeStep:"+val);
      self.choiceJoinVisible = false;
      self.confirmJoinVisible = false;
      self.newJoinVisible = false;
      self.joinFinishedVisible = false;

      if (val == 1) {
        self.choiceJoinVisible = true;
      } else if (val == 2) {
        self.confirmJoinVisible = true;
      } else if (val == 3) {
        self.newJoinVisible = true;
      } else if (val == 4) {
        self.joinFinishedVisible = true;
      }
    },
    changeEmailProviders(val){
     // console.log("emailCorpSelected:"+val)
      const self = this;
      self.user_emailCorp = val;
    },
    showLogin() {
      const self = this;
      self.$store.commit("setNeedLogin", true);
  	},
    isTrue(element, index, array) {
      return element == true;
    },
    //약관 처리
    showTermsCondition(termType) {
      let self = this;
      self.$EventBus.$emit("openTerm", termType);

      if (termType == 1) {

        document.getElementsByName('checkedItems1')[0].checked = true
       // self.checkedItems[0].checked = true;
        // return "서비스 이용약관";
      } else if (termType == 2) {

        document.getElementsByName('checkedItems3')[0].checked = true
       // self.checkedItems[2].checked = true;
        // return "법적고지 ";
      } else if (termType == 3) {

        document.getElementsByName('checkedItems4')[0].checked = true
        //self.checkedItems[3].checked = true;
        // return "개인정보처리방침";
      } else if (termType == 4) {

        document.getElementsByName('checkedItems2')[0].checked = true
        //self.checkedItems[1].checked = true;
        // return "";

      // } else if (termType == 5) {
      //   document.getElementsByName('checkedItems5')[0].checked = true

      //   // return "유료서비스 이용약관";
      // } else if (termType == 6) {
      //   document.getElementsByName('checkedItems6')[0].checked = true

        // return "결제정보 제공동의";
      } else {
        // return "";
      }
    },

    goMain() {
      let self = this;
      self.$router.push({ name:'Main' });
    },
    handleCheckAllChange(val) {
      let self = this;
      self.showCheckAll = val;
      self.checkAll = !val;

      if(self.checkAll == true)
      {
        document.getElementsByName('checkedItems1')[0].checked = true
        document.getElementsByName('checkedItems2')[0].checked = true
        document.getElementsByName('checkedItems3')[0].checked = true
        document.getElementsByName('checkedItems4')[0].checked = true
      }else
      {
        document.getElementsByName('checkedItems1')[0].checked = false
        document.getElementsByName('checkedItems2')[0].checked = false
        document.getElementsByName('checkedItems3')[0].checked = false
        document.getElementsByName('checkedItems4')[0].checked = false
      }
     // self.checkedItems = self.checkAll ? _lodash.cloneDeep(self.itemOptionsT) : _lodash.cloneDeep(self.itemOptionsF);

    },

    // clickConfirm(index) {
    //   const self = this;
    //   self.checkedItems[index].checked = true;
    //   self.agreeVisibles[index].checked = false;
    // },
    handleClick(tab, event) {
      const tabIndex = tab.index;
      const self = this;

      if (tabIndex == "1") {
        var sTitle = self.$t('registration.f001'); //외국인 서비스 준비중입니다
        self.$alert(sTitle, '', {
          confirmButtonText: self.$t('common.confirm'),//'확인'
          callback() {
            self.activeName = "korean";
          }
        });
      }
    },
    showAlert() {
      this.activeName = "korean";
      var sTitle = self.$t('registration.f001'); //외국인 서비스 준비중입니다
      this.$alert(sTitle, '', {
        confirmButtonText: self.$t('common.confirm')//'확인'
      });
    },
    clicked() {
      let self = this;

      //이용동의 체크가 통과 되면 휴대폰 인증 처리
      let isOk = false;
      let chkAgree1 = document.getElementsByName('checkedItems1')[0].checked;
      let chkAgree2 = document.getElementsByName('checkedItems2')[0].checked;
      let chkAgree3 = document.getElementsByName('checkedItems3')[0].checked;

      if(chkAgree1 == true &&
        chkAgree2 == true &&
        chkAgree3 == true
      ) {
      // if(self.checkedItems[0].checked == true &&
      //   self.checkedItems[1].checked == true &&
      //   self.checkedItems[2].checked == true
      // ) {
        isOk = true;
      }
      if(isOk) {
        // 임시 본인인증 예외처리
        // alert("휴대폰 인증 확인 완료");
        // self.confirmJoinVisible = false;
        // return;

        // self.popupId = window.open(process.env.CERT_URL,'pccPopup', "width=410,height=635");
        self.$EventBus.$emit('downChart');
        cordova.exec(null,null,"AppPlugin","loadWebView",[0,0,1,1,'',process.env.CERT_URL]);
        // window.addEventListener('message', self.pccCallback);
        // window.addEventListener('pccCallback', self.pccCallback);
      } else {
        var sTitle = self.$t('registration.f004'); //회원가입을 위해 [필수] 약관 동의에 동의해 주세요
        this.$alert(sTitle, '', {
          confirmButtonText: self.$t('common.confirm')//'확인'
        });
      }
    },
    //아이디,필명 중복확인
    confirmIdClicked(val) {
      const self = this;
      if(val == 'userid' && !self.validateId()) {
        return;
      }

      if(val == 'nick' && !self.validateNickName()) {
        return;
      }
      let header = {
        trName: 'at005'
      }

      var gbVal = '';
      var inputVal = '';
      if (val == 'userid') {
        gbVal = '1';
        inputVal = self.user_id;
      } else if (val == 'nick') {
        gbVal = '2';
        inputVal = self.nick_nm;
      } else {
        return;
      }

      let input = {
        InBlock1: [{
          check_gb: gbVal,
          input_data: inputVal
        }]
      }

      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log(queryData);
        if (queryData != null) {
          if (queryData.queryObj) {
            let output = queryData.queryObj.OutBlock1[0]

            if(output.rslt_cls == '1')
            {
                self.$alert(self.$t('registration.a017'), '', { 
                  confirmButtonText: self.$t('common.confirm')
                });
            }
            else
            {
                let rslt_msg = output.rslt_msg;
                self.$alert(rslt_msg, '', {
                  confirmButtonText: self.$t("common.confirm")
                });          

            }

            //중복체크 확인
            if (val == 'userid') {
              self.isIdDoubleChk = true;
            } else if (val == 'nick') {
              self.isNickDoubleChk = true;
            }
          } else {
            self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
              confirmButtonText: self.$t("common.confirm"),
            });
          }
        }
      });
    },
    registerKakaoClicked() {
      const self = this;

      if(!self.validateNickName()) {
        return;
      }

      //필명 중복 체크
      if(!self.isNickDoubleChk) {
        self.$alert(self.$t('registration.f014'), '', {
          confirmButtonText: self.$t('common.confirm')
        });
        return;
      }

      var strUserEmail = self.user_emailAddress +"@"+ self.user_emailCorp;
      if(!self.validateEmail()) {
        return;
      }

      //마케팅 이메일 수신여부 (Y/N)
      var emailGb = 'N';
      if(document.getElementsByName('checkedItems4')[0].checked == true) {
        emailGb = 'Y';
      }
      // if(self.checkedItems[3].checked == true) {
      //   emailGb = 'Y';
      // }

      let header = { trName: 'at330' }
      let input = {
        InBlock1: [{
          cert_key: self.di,
          user_id: self.kakao_id,
          nick_nm: self.nick_nm,
          user_nm: self.user_nm,
          user_phone: self.user_phone,
          email: strUserEmail,
          nation_gb: 'L', //default: 내국인('L'), 외국인('F')
          birthday: self.birthday,
          sex: self.sex,
          profile_image_url: self.profile_image_url,
          email_noti_gb: emailGb,
        }]
      }
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log(queryData);
        if (queryData != null) {
          if (queryData.queryObj) {

            if (queryData.queryObj.OutBlock1[0].rslt_cls == '1') {
              // var sTitle = queryData.queryObj.OutBlock1[0].rslt_msg;
              var sTitle = self.$t('registration.a016');
              self.$alert(sTitle, '', {
                confirmButtonText: self.$t('common.confirm')//'확인'
              });

              self.changeStep(4);
            } else {
              self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
                confirmButtonText: self.$t("common.confirm"),
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
    //회원가입
    registerClicked() {
      const self = this;

      if(!self.validateId()) {
        return;
      }
      //아이디 중복 체크
      if(!self.isIdDoubleChk) {
        self.$alert(self.$t('registration.f013'), '', {
          confirmButtonText: self.$t('common.confirm')//'확인'
        });
        return;
      }

      if(!self.validateNickName()) {
        return;
      }
      //필명 중복 체크
      if(!self.isNickDoubleChk) {
        self.$alert(self.$t('registration.f014'), '', {
          confirmButtonText: self.$t('common.confirm')//'확인'
        });
        return;
      }

      if(!self.validatePassword()) {
        return;
      }

      if(!self.validateEmail()) {
        return;
      }
      var strUserEmail = self.user_emailAddress +"@"+ self.user_emailCorp;

      //마케팅 이메일 수신여부 (Y/N)
      var emailGb = 'N';
      if( document.getElementsByName('checkedItems4')[0].checked = true) {
          emailGb = 'Y';
      }
      // if(self.checkedItems[3].checked == true) {
      //   emailGb = 'Y';
      // }

      let header = { trName: 'at002' }
      let input = {
        InBlock1: [{
          cert_key: self.di,
          user_id: self.user_id,
          nick_nm: self.nick_nm,
          user_pw: self.user_pw,
          user_nm: self.user_nm,
          user_phone: self.user_phone,
          email: strUserEmail,
          nation_gb: 'L', //default: 내국인('L'), 외국인('F')
          birthday: self.birthday,
          sex: self.sex,
          email_noti_gb: emailGb,
          sms_noti_gb: 'N',
          check_yn: 'Y',  //checkYn, //신규회원가입 Y , 통합ID가입 N
          join_route: '', //self.join_route,  //가입경로
          referee_cd: ''  //self.referee_cd   //추천인ID - 가입경로 추천인(2 인경우)
        }]
      }

      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log(queryData);
        if (queryData != null) {
          if (queryData.queryObj) {
            if (queryData.queryObj.OutBlock1[0].rslt_cls == '1') {
              // var sTitle = queryData.queryObj.OutBlock1[0].rslt_msg;
              var sTitle = self.$t('registration.a016');
              self.$alert(sTitle, '', {
                confirmButtonText: self.$t('common.confirm')//'확인'
              });

              self.changeStep(4);
            } else {
              self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
                confirmButtonText: self.$t("common.confirm"),
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
    validateId() {
      const self = this;
      if (self.user_id == '') {
        var sTitle = self.$t('registration.f002'); //아이디를 입력해주세요
        self.$alert(sTitle, '', {
          confirmButtonText: self.$t('common.confirm')//'확인'
        });
      } else if (!/^[A-Za-z\d]{6,16}$/.test(self.user_id)) {
        var sTitle = self.$t('registration.f005'); //아이디는 숫자, 영문자 6~16자리 입력해주세요
        self.$alert(sTitle, '', {
          confirmButtonText: self.$t('common.confirm')//'확인'
        });
      } else {
        return true;
      }
      return false;
    },
    validateNickName() {
      const self = this;
      if (self.nick_nm == '') {
        var sTitle = self.$t('mypage.d101.a004'); //필명을 입력해주세요
        self.$alert(sTitle, '', {
          confirmButtonText: self.$t('common.confirm')//'확인'
        });
      } else if (!/^[A-Za-z\dㄱ-ㅎ|ㅏ-ㅣ|가-힣]{2,12}$/.test(self.nick_nm)) {
        var sTitle = self.$t('registration.f006'); //필명은 숫자, 영문자, 한글 혼용가능하며 2~12자리 입력해주세요
        self.$alert(sTitle, '', {
          confirmButtonText: self.$t('common.confirm')//'확인'
        });
      } else {
        return true;
      }
      return false;
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
    validateEmail() {
      const self = this;

      //이메일 정규식
      // var regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

      var strUserEmail = self.user_emailAddress + '@' + self.user_emailCorp;
      // var bCheck = regExp.test(strUserEmail);

      if (self.user_emailAddress == '' ) {
        var sTitle = self.$t('registration.f011'); //이메일 주소를 다시 확인해주세요
        self.$alert(sTitle, '', {
          confirmButtonText: self.$t('common.confirm')//'확인'
        });
      } else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(strUserEmail)) {
        // 이메일 주소를 정확하게 입력해주세요
        self.$alert(self.$t('mypage.d102.a009'), '', {
          confirmButtonText: self.$t('common.confirm')
        });
      } else {
        return true;
      }
      return false;
    },
    pccCallback(e) {
      console.log("regi pccCallback...:"+e.detail);
      let self = this;
      // window.removeEventListener('message', self.pccCallback);
      window.removeEventListener('pccCallback', self.pccCallback);
      if (self.popupId) {
        self.popupId.close();
      }
      cordova.exec( null , null, "AppPlugin" , "destroyWebView", null);      //본인인증 웹뷰 삭제
      self.$EventBus.$emit('upChart');
      // window.alert("pccCallback_e.data.di:"+e.data.di);
      console.log("regi pccCallback222222:"+e.detail.di);
      if (e.detail.di) {
        console.log('pccCallback_di', e.detail.di);
        console.log('pccCallback_user_brth_day', e.detail.birYMD);
        console.log('pccCallback_외국인구분', e.detail.fgnGbn);
        console.log('pccCallback_phone', e.detail.cellNo);
        console.log('pccCallback_username', decodeURI(e.detail.name));
        self.di = e.detail.di;
        self.sex = e.detail.sex;
        self.birthday = e.detail.birYMD;

        //회원가입 필드 채움
        self.user_nm = decodeURI(e.detail.name);
        self.user_phone = e.detail.cellNo;

        //만 19세 미만은 회원가입 불가
        if (self.calcAge(e.detail.birYMD) < 18) {
           console.log('regi pccCallback_calcAge', "만 19세 미만은 회원가입 불가");
          var sTitle = self.$t('registration.f009'); //만 19세 미만은 회원가입이 불가합니다
          self.$alert(sTitle, '', {
            confirmButtonText: self.$t('common.confirm'),//'확인'
            callback: function() {
              self.$router.push({ name:'Main' });
            }
          });
          return;
        }
      } else {
        // 본인인증에 실패하였습니다.
        self.$alert(self.$t('mypage.d103.a014'), '', {
          confirmButtonText: self.$t('common.confirm')
        });
      }
      console.log('regi pccCallback_self.di', self.di);
      if (self.di != '') {
        self.changeStep(3);
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
    console.log("regi_mounted!");
    window.addEventListener('pccCallback', this.pccCallback);
    // window.addEventListener('message', this.pccCallback);
  },
  created() {
    const self = this;
    self.$EventBus.$on("changeLangType", self.changeLangType);
    self.$EventBus.$emit("setLogo", {
      type: "",
      text: "회원가입" //self.$t('expert.a001')
    });
    self.$EventBus.$emit("setMenuIndex", "5-1");
  },
  destroyed(){
		window.removeEventListener('pccCallback', this.pccCallback);
	}
}
</script>
