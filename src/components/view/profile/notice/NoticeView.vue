<template>
	<div>
		<div class="board-list">
			<ul>
				<li v-for="item in noticeList" :key="item.mtextId">
          <div class="board-view">
            <div class="board-head">
              <h2 class="title">{{ item.subj }}</h2>
              <div class="date">
                <span>{{ item.regDt | dateFormat }}</span>
              </div>
            </div>

            <div class="board-body" v-html="item.conts"></div>

            <div class="btns"></div>
          </div>
				</li>
        
				<!-- 공지사항 없음 -->
				<li v-if="noticeList.length < 1" class="no-data">{{ $t("cs.a005") }}<!-- 데이터가 없습니다. -->
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import { sendApi } from '@/api';

export default {
  data() {
    return {
      boardId: 1, // 시온 공지사항 게시판번호
      curPage: 1,
      pageCount: 10,
      noticeList: [],
    };
  },
  methods: {
    getData() {
      const self = this;
    },
    changeLangType() {
      const self = this;

      // 값 초기화
      self.curPage = 1;
      self.noticeList = [];

      // 데이터 불러오기
      self.getData();
    }
  },
  created() {
  },
  mounted() {
    const self = this;
		self.getData();
  }
}
</script>
