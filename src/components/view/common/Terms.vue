<template>
	<el-dialog :visible.sync="termsVisible" :show-close="true" :close-on-click-modal="false" class="mob modal modal-turms" width="100%" top="0px" append-to-body>
		<template slot="title">
			<div class="terms-head">
				<span class="el-dialog__title">{{ termFormat(termType) }}</span>
				<el-select v-model="mtextId" @change="getTerm" class="select select-sizeS" style="width: 110px;">
					<el-option v-for="item in list" :key="item.mtextId" :label="item.regDt | dateFormat3" :value="item.mtextId"></el-option>
				</el-select>
			</div>
		</template>
		<div class="section" style="padding-bottom: 0;">
			<div v-html="data.conts" class="terms"></div>
		</div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="goClose" class="button button-bg03 block">{{ $t("common.confirm") }}</el-button>
    </div>
	</el-dialog>
</template>


<script>
import {mapGetters	} from "vuex";
import {sendApi	} from '@/api';

export default {
	 data() {
		return {
			termsVisible: false,
			mtextId: 0,
			data: {},
			list: [],
			termType: 0,
		};
     },
	 methods: {
        termFormat(termType) {
      		const self = this;
			if (termType == 1) {
			// 이용약관
				return self.$t("footer.b001");
			} else if (termType == 2) {
			// 개인정보처리방침
				return self.$t("footer.b002");
			} else if (termType == 3) {
			// 해외시세제공약관
				return self.$t("footer.b003");
			} else if (termType == 4) {
			// 법적고지
				return self.$t("footer.b004");
			} else if (termType == 5) {
			// 유료서비스 이용약관
				return self.$t("footer.b005");
			} else if (termType == 6) {
			// 결제정보 제공동의
				return self.$t("footer.b006");
			} else {
				return "";
			}
		},
		goClose() {
			const self = this;
			self.termsVisible = false;
		},
		termCallback(res) {
			const self = this;
			if (res) {
				self.data = res;
			}
		},
		getTerm() {
			const self = this;
			if (self.mtextId > 0) {
				let params = {
					mtextId: self.mtextId
				};
				sendApi('/terms/view', params, self.termCallback);
			}
		},
		listCallback(res) {
			const self = this;
			if (res) {
				self.list = res.list;
				if (self.list.length > 0) {
					self.mtextId = self.list[0].mtextId;
					self.getTerm();
				}
			}
		},
		getData() {
			const self = this;
			let params = {
				termType: self.termType,
				langType: self.$i18n.locale
			};
			window.document.removeEventListener("backbutton", self.closeTerms);
			sendApi('/terms/front_list', params, self.listCallback);
		},
		openTerm(termType) {
			const self = this;
			console.log("openTerm")
			self.mtextId = 0;
			self.data = {};
			self.list = [];
			self.termType = termType;

			self.getData();
			self.termsVisible = true;
			window.document.addEventListener("backbutton", self.closeTerms, false);
		},
		closeTerms() {
			const self = this;
			self.termsVisible = false;
			window.document.removeEventListener("backbutton", self.closeTerms);
		}
	},
	created() {
		const self = this;
		self.$EventBus.$on("openTerm", self.openTerm);
	},
	mounted() {
		const self = this;
		// window.document.addEventListener("backbutton", self.closeTerms, false);
	},
	beforeDestroy() {
		const self = this;
		self.$EventBus.$off("openTerm", self.openTerm);
		window.document.removeEventListener("backbutton", self.closeTerms);
	}
}
</script>
<style>
.mob.modal .el-dialog .el-dialog__body {
    padding: 0;
    height: calc(100%);
    background-color: #fff;
}
</style>
