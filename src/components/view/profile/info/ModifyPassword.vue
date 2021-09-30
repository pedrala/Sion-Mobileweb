<template>
	<!-- dialog -->
	<div class="section">
			<el-form ref="form" class="form">
				<div class="item">
					<span class="name">{{ $t('mypage.d100.a002') }}<!-- 현재 비밀번호 --></span>
					<el-input v-model="check_data" type="password" :placeholder="$t('mypage.d100.a005')" class="input"></el-input><!-- 비밀번호를 입력해주세요. -->
				</div>
				<div class="item">
					<span class="name">{{ $t('mypage.d100.a003') }}<!-- 신규 비밀번호 --></span>
					<el-input v-model="update_data" type="password" :placeholder="$t('mypage.d100.a006')" class="input"></el-input><!-- 신규 비밀번호를 입력해주세요. -->
				</div>
				<div class="item">
					<span class="name">{{ $t('mypage.d100.a004') }}<!-- 비밀번호 확인 --></span>
					<el-input v-model="update_data2" type="password" :placeholder="$t('mypage.d100.a007')" class="input"></el-input><!-- 입력하신 비밀번호를 다시 한번 입력해주세요. -->
				</div>
			</el-form>
			<ul class="bullet bullet-type01 bullet-color02 color04">
				<li>{{ $t('mypage.d100.a008') }}</li><!-- 비밀번호는 영문/숫자/특수문자 조합 8~16자리를 입력해주세요. -->
     		    <li>{{ $t('mypage.d100.a014') }}</li><!-- 특수문자는 @$!%*#?&().=_+를 허용합니다. -->
			    <li>{{ $t('mypage.d100.a009') }}</li><!-- 동일한 숫자/문자 또는 연속된 숫자 3글자 이상의 비밀번호를 입력할 수 없습니다 -->
			</ul>
			<!-- btns -->
			<div class="btns">
				<el-button @click="updatePassword" class="button button-bg03 block">{{ $t('common.confirm') }}</el-button>
			</div>
			<!-- //btns -->
	</div>
</template>

<script>
	import {
		mapGetters
	} from "vuex";

	export default {
		computed: {
			...mapGetters(['getUserInfo', 'isSocketConnected'])
		},
		data() {
			return {
				dialogVisible: false,
				check_data: '',
				update_data: '',
        update_data2: '',
        visibleCapsLock1: false,
        visibleCapsLock2: false,
        visibleCapsLock3: false,
      };
		},
		methods: {
      checkCaps(event, idx) {
        console.log(event.getModifierState("CapsLock"), idx);
        const self = this;
        if (event.getModifierState("CapsLock")) {
          if (idx == 0) {
            self.visibleCapsLock1 = true;
          } else if (idx == 1) {
            self.visibleCapsLock2 = true;
          } else if (idx == 2) {
            self.visibleCapsLock3 = true;
          }
        } else {
          self.visibleCapsLock1 = false;
          self.visibleCapsLock2 = false;
          self.visibleCapsLock3 = false;
        }
      },
			validatePassword() {
				const self = this;

				if (self.check_data == '') {
          // 현재 비밀번호를 입력해주세요
					self.$alert(self.$t('mypage.d100.a005'), '', {
						confirmButtonText: self.$t('common.confirm')
					});
				} else if (self.update_data == '') {
          // 신규 비밀번호를 입력해주세요
					self.$alert(self.$t('mypage.d100.a006'), '', {
						confirmButtonText: self.$t('common.confirm')
					});
				} else if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&().=_+])[A-Za-z\d@$!%*#?&().=_+]{8,16}$/.test(self.update_data)) {
          // 비밀번호는 영문/숫자/특수문자 조합 8~16자리를 입력해주세요.<br>특수문자는 @$!%*#?&().=_+를 허용합니다.
					self.$alert(self.$t('mypage.d100.a015'), '', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: self.$t('common.confirm'),
            
					});
				} else if (/(\w)\1\1/.test(self.update_data)) {
          // 동일한 숫자/문자 또는 연속된 숫자 3글자 이상의 비밀번호를 입력할 수 없습니다
					self.$alert(self.$t('mypage.d100.a009'), '', {
						confirmButtonText: self.$t('common.confirm')
					});
				} else if (/(012)|(123)|(234)|(345)|(456)|(567)|(678)|(789)|(890)/.test(self.update_data)) {
          // 동일한 숫자/문자 또는 연속된 숫자 3글자 이상의 비밀번호를 입력할 수 없습니다
					self.$alert(self.$t('mypage.d100.a009'), '', {
						confirmButtonText: self.$t('common.confirm')
          });
        } else if (self.check_data == self.update_data) {
          // 신규 비밀번호는 현재 비밀번호와 달라야 합니다.
					self.$alert(self.$t('mypage.d100.a013'), '', {
						confirmButtonText: self.$t('common.confirm')
					});
				} else if (self.update_data2 == '') {
          // 입력하신 비밀번호를 다시 한번 입력해주세요.
					self.$alert(self.$t('mypage.d100.a007'), '', {
						confirmButtonText: self.$t('common.confirm')
					});
				} else if (self.update_data != self.update_data2) {
          // 신규 비밀번호가 일치하지 않습니다
					self.$alert(self.$t('mypage.d100.a010'), '', {
						confirmButtonText: self.$t('common.confirm')
					});
				} else {
					return true;
				}
				return false;
			},
			updateCallback(queryData) {
				const self = this;

				if (queryData.queryObj) {
					let output = queryData.queryObj.OutBlock1[0];
					if (output != null) {
						if (output.rslt_cls == '1') {
              // 비밀번호 변경이 완료되었습니다
							self.$alert(self.$t('mypage.d100.a011'), '', {
								confirmButtonText: self.$t('common.confirm'),
								callback: function() {
									self.$EventBus.$emit('reloadInfo');
									self.dialogVisible = false;
								}
							});
						} else {
							let rslt_msg = output.rslt_msg;
							self.$alert(rslt_msg, '', {
								confirmButtonText: self.$t('common.confirm')
							});
						}
					}
				} else {
					self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
            confirmButtonText: self.$t("common.confirm"),
          });
				}
			},
			updatePassword() {
				const self = this;
				if (self.validatePassword()) {
					let header = { trName: 'at007' }
					let input = {
						InBlock1: [{
							enc_user_id: self.getUserInfo.user_id,
							update_gb: 1,
							check_data: self.check_data,
							update_data: self.update_data
						}]
					}
					self.$socket.sendProcessByName(header, input, function(queryData) {
            console.log("updatePassword", queryData);
						if (queryData != null) {
							self.updateCallback(queryData);
						}
					});
				}
			},
		},
		created() {
			const self = this;
			self.$EventBus.$emit("setLogo", {
				type: "",
				text: "비밀번호변경"
			}); 
		},
		mounted() {},
		beforeDestroy() {
		}
	}
</script>
