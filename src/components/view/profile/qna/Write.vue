<template>
	<div class="content">
		<div class="board-write">
			<div class="item">
				<input v-model='form.q_title' v-on:input='form.q_title = $event.target.value' v-on:keyup='validateTitle' class="input block qna_input" :placeholder="$t('cs.c022')">
			</div>

			<div class="item" style="flex:1">
        <vue-editor v-model="form.q_msg" useCustomImageHandler @image-added="handleImageAdded" :editorToolbar="customToolbar"></vue-editor>
			</div>

			<div class="btns">
				<el-button @click="submit" class="button button-bg02 block" :disabled="regiDisabled">{{ $t("cs.c025") }}<!-- 등록하기 --></el-button>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from "vuex"
import { VueEditor } from 'vue2-editor'
import axios from 'axios'

export default {
	components: {
    VueEditor,
	},
	computed: {
		...mapGetters(['getUserInfo', 'isSocketConnected']),
	},
  data() {
		return {
			customToolbar: [
				[{ 'size': ['small', false, 'large', 'huge'] }],
				['bold', 'underline', 'strike'],
				['image'],
				[{ 'color': [] }, { 'background': [] }],
				[{'align': ''}, {'align': 'center'}, {'align': 'right'}, {'align': 'justify'}],
				[{ 'list': 'ordered'}, { 'list': 'bullet' }, /*{ 'list': 'check' }*/],
				[{ 'indent': '-1'}, { 'indent': '+1' }],
			],

			form: {
				q_title: '',
				q_msg: '',
			},
			q_seq: 0,
			whiteList: ["image/gif", "image/jpeg", "image/png"],
			regiDisabled: false
		};
	},
	methods: {
  	handleImageAdded: function(file, Editor, cursorLocation, resetUploader) {
			const self = this;
			let tmp = self.whiteList.filter(item => item == file.type);
			if (tmp.length <= 0) {
				// 이미지 파일만 업로드가능합니다.
				self.$alert(self.$t('cs.c039'), '', {
					confirmButtonText: self.$t("common.confirm")
				});
				resetUploader();
				return;
			}

			if (file.size > 1048576) {
				// 이미지 용량을 초과했습니다. (최대 1MB)
				self.$alert(self.$t('cs.c038'), '', {
					confirmButtonText: self.$t("common.confirm")
				});
				resetUploader();
				return;
			}

			var formData = new FormData();
			formData.append("uploadfile", file);
			formData.append("regr", self.getUserInfo.user_id);
			formData.append("validkey", "bc89d2c5W00f1a2b324604KW74030b2521Y4b4Abf30bd4b438a4Fd7ff49");

			axios({
				url: process.env.IMG_URL + "/upload.php",
				method: "POST",
				data: formData
			}).then(result => {
				if (result.data > 0) {
					let url = process.env.IMG_URL + "/view.php?id=" + result.data; // Get url from response
					Editor.insertEmbed(cursorLocation, "image", url);
					resetUploader();
				}
			}).catch(err => {
				resetUploader();
				console.log(err);
			});
		},
		cancel() {
			const self = this;
			// 1:1 문의 작성을 취소하시겠습니까?
			history.back(-1);
		},
		insertCallback(queryData) {
			const self = this;
			if (queryData.queryObj) {
				console.log("insertCallback", queryData);
				let output = queryData.queryObj.OutBlock1[0];
				if (output != null) {
					if (output.rslt_cls == '1') {
						// 등록이 완료되었습니다.
						self.$alert(self.$t("cs.c027"), '', {
							confirmButtonText: self.$t("common.confirm"),
							callback: function() {
                let token = { curPage: 1, q_state: '' };
                self.$store.commit("setBbsInfo", token);
                localStorage.removeItem("SION_QNALIST");
                self.$router.push({ path: '/profile/qna/list' });
              }
						});
					} else {
						//등록 실패시 등록버튼 활성화
						self.regiDisabled = false
						let rslt_msg = output.rslt_msg;
						self.$alert(rslt_msg, '', {
							confirmButtonText: self.$t("common.confirm")
						});
					}
				}
			} else {
				//등록 실패시 등록버튼 활성화
				self.regiDisabled = false;
				self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
					confirmButtonText: self.$t("common.confirm"),
				});
			}
		},
		insertData() {
			const self = this;
			let header = { trName: 'at018' }
			// q_seq > 0 수정 / q_seq = 0 등록
			let input = {
				InBlock1: [{
					proc_gb: self.q_seq>0?'1':'0',
					q_seq: self.q_seq>0?self.q_seq:'',
					q_state: self.q_seq>0?self.q_state:'',
					user_id: self.getUserInfo.user_id,
					nick_nm: self.getUserInfo.user_nnm,
					q_div: '',
					q_title: self.form.q_title,
					q_msg: self.form.q_msg
				}]
      }

      //등록버튼 클릭시 등록버튼 비활성화
			self.regiDisabled = true;
			self.$socket.sendProcessByName(header, input, function(queryData) {
				console.log("output_at018", queryData);
				if (queryData != null) {
					self.insertCallback(queryData);
				}
			});
		},
		submit() {
			const self = this;
			if (!self.validateTitle()) {
				return;
			}
			if (!self.validateMsg()) {
				return;
			}

			if (self.getUserInfo) {
				if (self.isSocketConnected) {
					self.insertData();
				} else {
				  // 통신오류 잠시후 다시 시도해주세요
					self.$alert(self.$t("cs.c028"), '', {
						confirmButtonText: self.$t("common.confirm")
					});
				}
			} else {
				history.back(-1);
			}
		},
		validateTitle(event) {
			const self = this;

			if (event == null) {
				if (self.form.q_title == '') {
					// 제목을 입력해주세요
					self.$alert(self.$t("cs.c030"), '', {
						confirmButtonText: self.$t("common.confirm")
					});
					return false;
				}
			}

			if (self.form.q_title.length > 50) {
				// 50자 이하로 입력해주세요
				self.$alert(self.$t("cs.c031"), '', {
					confirmButtonText: self.$t("common.confirm"),
					callback() {
						self.form.q_title = self.form.q_title.substring(0, 50);
					}
				});
				return false;
			}
			return true;
		},
		validateMsg() {
			const self = this;
			if (self.form.q_msg == '') {
        // 내용을 입력해주세요
        self.$alert(self.$t("cs.c032"), '', {
          confirmButtonText: self.$t("common.confirm")
        });
        return false;
			}

			if (self.form.q_msg.length > 2000) {
			self.form.q_msg = self.form.q_msg.substring(0, 2000);
				// 2000자 이하로 입력해주세요
				self.$alert(self.$t("cs.c033"), '', {
					confirmButtonText: self.$t("common.confirm")
				});
				return false;
			}
			return true;
		},
		viewCallback(queryData) {
			const self = this;
			if (queryData.queryObj) {
				let output = queryData.queryObj.OutBlock1[0];
				if (output != null) {
					if (output.rslt_cls == '1') {
						self.form = output;
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
		getData() {
			const self = this;
			let header = { trName: 'at019' }
			let input = {
				InBlock1: [{
					seq_no: self.q_seq,
					user_id: self.getUserInfo.user_id
				}]
			}
			self.$socket.sendProcessByName(header, input, function(queryData) {
			  console.log("getData", queryData);
				if (queryData != null) {
					self.viewCallback(queryData);
				}
			});
		}
	},
	created() {
    const self = this;
    self.q_seq = self.$route.query.q_seq;	
    self.$EventBus.$emit("setLogo", { type: "", text: self.$t('cs.c037') }); /router-link/ 1:1문의하기

    //백버튼 클릭시 내용 있으면 얼럿창 띄움
    const backButtonRouteGuard = self.$router.beforeEach((to, from, next) => {
      if (self.regiDisabled) {
        next(true);
      } else {
			  // 1:1 문의 작성을 취소하시겠습니까?
				self.$confirm(self.$t("cs.c026"), {
					confirmButtonText: self.$t("common.confirm"),
					cancelButtonText: self.$t("common.cancel"),
				}).then(() => {
					next(true);
				}).catch(() => {
					next(false);
				});			
			}
    });

		self.$once('hook:beforeDestroy', () => {		
			backButtonRouteGuard();
		});
	},
	mounted() {
    const self = this;
    if (self.q_seq > 0) {
      if (self.isSocketConnected) {
        self.getData();
      }
      self.$EventBus.$on('socketConnected', self.getData);
    }
  },
	beforeDestroy() {
    console.log("beforeDesto");
    const self = this;
    if (self.q_seq > 0) {
      self.$EventBus.$off('socketConnected', self.getData);
    }
  }
}
</script>

<style>
.qna_input {
  padding: 0 15px;
  font-weight: 300;
  color: #333;
}
</style>
