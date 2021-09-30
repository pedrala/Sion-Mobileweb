<template>
  <div>
    <ul class="notice-list" style="margin-bottom: 60px;">
      <li v-for="item in list" :key="item.mtextId">
        <div class="notice-list-header">
          <div class="notice-list-header-icon">
            <div class="user-icon" v-bind:style="{ backgroundImage: 'url(./static/image/img_logo.png)' }">
            </div>
          </div>
          <div class="notice-list-header-info">
            시온 (SiON 운영자)
            <span class="date">{{ item.regDt | dateFormat }}</span>
          </div>
        </div>

        <div class="notice-list-content" v-wave @click="goView(item)">
          <div class="notice-list-title">
            <span style="line-height: 20px;">[공지사항]</span>
          </div>
          <div class="notice-list-body" v-html="item.conts"><!-- v-html="item.conts" -->
          </div>
          <div class="notice-list-more" v-if="item.isView">
            ...더보기
          </div>
        </div>

        <div class="notice-list-image" v-if="item.fileId > 0">
          <img :src="getImageUrl(item.fileId)">
        </div>
      </li>
      <!-- 공지사항 없음 -->
      <li v-if="list.length < 1" class="no-data">{{ $t("cs.a005") }}<!-- 데이터가 없습니다. -->
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
import { sendApi } from '@/api';

export default {
  components: {
    InfiniteLoading,
  },
  data() {
    return {
      mtextId: 0,
      pageCount: 10,
      list: [],
      isInfinite: false,
    };
  },
  methods: {
    chkConts(conts) {
      let count = (conts.match(/<p>/g) || []).length;
      if (count < 6) {
        return false;
      } else {
        return true;
      }
    },
    goView(item) {
      if (item.isView) {
        const self = this;
        self.$router.push({
          path: '/timeLine/view',
          query: { mtextId: item.mtextId }
        });        
      }
    },
    getImageUrl(file_id) {
      if (file_id && file_id != '') {
        return process.env.IMG_URL + "/view.php?id=" + file_id;
      } else {
        return "";
      }
    },
    infiniteHandler($state) {
      console.log("infiniteHandler start");
      const self = this;
      let params = {
        mtextId: self.mtextId,
        pageCount: self.pageCount,
        langType: self.$i18n.locale,
      };
      sendApi('/notice/appList', params, data => {
        console.log("infiniteHandler", data);
        $state.complete();
        if (data) {
          if (data.list.length > 0) {
            data.list.forEach(item => {
              item.isView = self.chkConts(item.conts);
            });

            self.list = self.list.concat(data.list);

            $state.loaded();
            self.mtextId = data.list[data.list.length-1].mtextId;
          } else {
            $state.complete();
          }
        }
      });
    },
    getData() {
      const self = this;
      if (self.isInfinite) {
        self.$refs.infiniteLoading.stateChanger.reset();
      } else {
        self.isInfinite = true;
      }
    },
    changeLangType() {
      const self = this;

      // 값 초기화
      self.mtextId = 0;
      self.list = [];

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
