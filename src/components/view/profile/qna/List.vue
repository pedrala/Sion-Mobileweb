<template>
	<div class="content">
		<div class="qna-btns">
			<el-button @click="goWrite" class="button button-bg03 block">
				{{ $t("cs.c001") }}<!-- 문의하기 -->
			</el-button>
		</div>

    <ul>
      <li class="header">
        <div class="date">날짜</div>
        <div class="title">제목</div>
        <div class="state">상태</div>
      </li>
      <li class="list" v-for="item in qnaList" :key="item.q_seq" @click="goView(item.q_seq)">
        <div class="date">{{ item.q_dt | dateFormat6 }}</div>
        <div class="title">{{ item.q_title }}</div>
        <div class="state">{{ item.q_state=='N'?'대기':'완료' }}</div>
      </li>
      <li v-if="qnaList.length < 1" class="no-data" style="display: block;">
        {{ $t('cs.c034') }}<!-- 데이터가 없습니다. -->
      </li>
    </ul>

		<infinite-loading v-if="isInfinite" spinner="spiral" ref="infiniteLoading" @infinite="infiniteHandler">
			<div slot="no-more"></div>
			<div slot="no-results"></div>
		</infinite-loading>
	</div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading';
import { mapGetters } from "vuex";

export default {
  components: {
    InfiniteLoading,
  },
  computed: {
    ...mapGetters([ 'getBbsInfo', 'getUserInfo', 'isSocketConnected'])
  },
  data() {
    return {
      isInfinite: false,
      curPage: 1,
      pageCount: 20,
      qnaList: [],
    };
  },
  methods: {
    infiniteHandler($state) {			
      const self = this;
      let header = { trName: 'at017' }
      let input = {
        InBlock1: [{
          user_id: self.getUserInfo.user_id,
          page_no: self.curPage,
          page_div_cnt: self.pageCount,
          q_state: '', //Y :답변완료 / N:답변대기/ 공백: 전체
        }]
      }
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("infiniteHandler", queryData);
        if (queryData != null) {
          if (queryData.queryObj) {
            let output = queryData.queryObj.OutBlock1[0];
            if (output != null) {
              if (output.rslt_cls == '1') {
                if (output.out_cnt * 1 > 0) {
                  //리스트 저장 (글보기후 뒤로가기시 목록)
                  self.qnaList = self.qnaList.concat(queryData.queryObj.OutBlock2);
                  localStorage.setItem("SION_QNALIST", JSON.stringify(self.qnaList));

                  self.curPage += 1;
                  $state.loaded();
                  self.setQnA();
                } else {
                  $state.complete();
                }
              } else {
                let rslt_msg = output.rslt_msg;
                self.$alert(rslt_msg, '', {
                  confirmButtonText: self.$t("common.confirm")
                });
                $state.complete();
              }
            }
          } else {
            self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
              confirmButtonText: self.$t("common.confirm"),
            });
            $state.complete();
          }
        } else {
          $state.complete();
        }
      });
    },
    getData() {
      const self = this;
      if (self.isInfinite) {
        self.qnaList = [];
        self.curPage = 1;
        self.$refs.infiniteLoading.stateChanger.reset();
      } else {
        self.isInfinite = true;
      }
    },
    setQnA() {
      const self = this;
      self.$store.commit('setBbsInfo', {
        curPage: self.curPage,
      });
    },		
    goView(q_seq) {
      const self = this;
      localStorage.setItem("SION_SCROLL", window.scrollY);
      self.$router.push({
        name: "ProfileQnAView",
        query: { q_seq: q_seq * 1 }
      });

    },
    goWrite() {
      const self = this;
      self.$router.push({ path: '/profile/qna/write' });
    },
  },
  created() {
    const self = this;
    self.$EventBus.$emit("setLogo", { type: "",  text:  "1:1문의"   }); // 1:1문의내역 self.$t('cs.c035')

    self.curPage = self.getBbsInfo.curPage;

    var strQnAList = localStorage.getItem("SION_QNALIST");
    if (strQnAList) {
      self.qnaList = JSON.parse(strQnAList);
      let scroll = localStorage.getItem("SION_SCROLL");
      self.$nextTick(() => {
        window.scroll(0, scroll);
      });
    }
    self.$EventBus.$emit("setMenuIndex", "3-7");
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

<style scoped>
.content ul li {
  display: flex;
  text-align: center;
  line-height: 40px;
}
.content ul li .date {
  width: 70px;
}
.content ul li .title {
  width: calc(100% - 140px);
}
.content ul li .state {
  width: 70px;
}
.content ul li.list .date {
  font-size: 11px;
}
.content ul li.list .title {
  display: inline-flex;
  float: left;
}
.content ul li.list .state {
  font-size: 11px;
}
</style>
