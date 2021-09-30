<template>
	<!-- dialog -->
	<!-- <el-dialog :title="$t('mypage.d102.a001')" :visible.sync="dialogVisible" width="100%" top="0px" :close-on-click-modal="false" class="mob modal"> -->
		<div class="section">
			<el-form ref="form" class="form">
				<div class="item">
					<span class="name">{{ $t('mypage.d102.a002') }}<!-- 현재 이메일 --></span>
					<el-input v-model="email" :title="$t('mypage.d102.a002')" class="input" disabled>{{email}}</el-input><!-- 현재 이메일 -->
				</div>
				<div class="item">
					<span class="name">{{ $t('mypage.d102.a003') }}<!-- 신규 이메일 --></span>
					<el-input v-model="input_data" :placeholder="$t('mypage.d102.a004')" class="input"></el-input><!-- 변경하실 이메일을 입력해주세요 -->
				</div>
			</el-form>
			<ul class="bullet bullet-type01 bullet-color02 color04">
				<li>{{ $t('mypage.d102.a005') }}<!-- 이메일 형식에 유의하여 입력해주세요 (ex. admin@naver.com) --></li>
        <li>{{ $t('mypage.d102.a006') }}<!-- 본인의 이메일 주소가 맞는지 다시 한번 확인해주세요. --></li>
        <li>{{ $t('mypage.d102.a007') }}<!-- 오입력으로 발생되는 불이익은 당사에서 책임지지 않습니다. --></li>
			</ul>
			<div class="btns">
				<el-button @click="updateEmail" class="button button-bg03 block">{{ $t('common.confirm') }}</el-button>
			</div>
		</div>
	<!-- </el-dialog> -->
	<!-- //dialog -->
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
				email: '',
				input_data: '',
			};
		},
		methods: {
			validateEmail() {
				const self = this;

				if (self.input_data == '') {
          // 이메일 주소를 입력해주세요
					self.$alert(self.$t('mypage.d102.a008'), '', {
						confirmButtonText: self.$t('common.confirm')
					});
				} else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(self.input_data)) {
          // 이메일 주소를 정확하게 입력해주세요
					self.$alert(self.$t('mypage.d102.a009'), '', {
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
              // 이메일 변경이 완료되었습니다
							self.$alert(self.$t('mypage.d102.a010'), '', {
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
			updateEmail() {
				const self = this;
				if (self.validateEmail()) {
					let header = { trName: 'at007' }
					let input = {
						InBlock1: [{
							enc_user_id: self.getUserInfo.user_id,
							update_gb: 4,
							update_data: self.input_data
						}]
					}
					self.$socket.sendProcessByName(header, input, function(queryData) {
            console.log("updateEmail", queryData);
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
				text: "이메일변경"
			}); 
			if (self.$route.query.email) 
			{
				self.email = self.$route.query.email;
			}
		},
		mounted() {}
	}
</script>
