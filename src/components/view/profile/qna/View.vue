<template>
	<div>
		<div v-if="data" class="board-view">
			<el-form v-if="data.q_msg" ref="form" :model="data">
				<div class="board-head">
					<h2 class="title">{{ data.q_title }}</h2>
					<div class="date">{{ data.q_dt | dateFormat2 }}</div>
				</div>
				<div class="board-body" style="padding: 0;">
					<div class="qna">
						<el-form v-if="data.q_msg" ref="form" :model="data" label-width="0px">
							<el-form-item>
								<div class="q">
									<div class="qna-body" v-html="data.q_msg"></div>
								</div>
							</el-form-item>
						</el-form>
						<el-form v-if="data.a_msg" ref="form" :model="data" label-width="0px">
							<el-form-item>
								<div class="a">
									<div class="qna-body" v-html="data.a_msg"></div>
								</div>
							</el-form-item>
						</el-form>
					</div>
				</div>

        <div class="btns justify">
          <el-button class="button button-bg05" @click="goModify">{{ $t("cs.c008") }}<!-- 수정하기 --></el-button>
          <el-button class="button button-bg06" @click="onDelete">{{ $t("cs.c009") }}<!-- 삭제하기 --></el-button>
        </div>

				<div class="btns">
					<el-button class="button button-bg02 block" @click="goList">{{ $t("cs.c010") }}<!-- 목록보기 --></el-button>
				</div>
			</el-form>
		</div>
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
			q_seq: 0,
			data: {},
		};
	},
  methods: {
    deleteCallback(queryData) {
      const self = this;
      if (queryData.queryObj) {
        let output = queryData.queryObj.OutBlock1[0];
        if (output != null) {
          if (output.rslt_cls == '1') {
            let token = { curPage: 1, q_state: '' };
            self.$store.commit("setBbsInfo", token);
            localStorage.removeItem("SION_QNALIST");
            self.$router.push({ path: '/profile/qna/list' });
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
    delete() {
      const self = this;
      let header = { trName: 'at018' }
      let input = {
        InBlock1: [{
          proc_gb: '2',
          q_seq: self.data.seq_no * 1,
          q_state: self.data.q_state,
          user_id: self.getUserInfo.user_id
        }]
      }
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("delete", queryData);
        if (queryData != null) {
          self.deleteCallback(queryData);
        }
      });
    },
    onDelete() {
      const self = this;
      // 삭제하시겠습니까?
      self.$confirm(self.$t("cs.c018") , {
        confirmButtonText: self.$t("common.confirm"),
        cancelButtonText: self.$t("common.cancel"),
        center: true,
      }).then(() => {
        self.delete();
      });
    },
    goModify() {
      const self = this;
      self.$router.push({
        path: '/profile/qna/write',
        query: { q_seq: self.data.seq_no * 1 }
      });
    },
    goList() {
      history.back(-1);
    },
    viewCallback(queryData) {
      const self = this;
      if (queryData.queryObj) {
        let output = queryData.queryObj.OutBlock1[0];
        if (output != null) {
          if (output.rslt_cls == '1') {
            self.data = output;
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
          seq_no:  self.q_seq,
          user_id: self.getUserInfo.user_id
        }]
      }
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("getData_at019", queryData);
        if (queryData != null) {
          self.viewCallback(queryData);
        }
      });
    }
  },
	created() {
    const self = this;
    self.q_seq = self.$route.query.q_seq;	
    self.$EventBus.$emit("setLogo", { type: "", text:"문의내역" }); // 1:1문의상세 text: self.$t('cs.c036')
	},
	mounted() {
		const self = this;
		if (self.isSocketConnected) {
			self.getData();
		}
		self.$EventBus.$on('socketConnected', self.getData);
	},
	beforeDestroy() {
		const self = this;
		self.$EventBus.$off('socketConnected', self.getData);	
	}
}
</script>
