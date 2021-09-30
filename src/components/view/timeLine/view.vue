<template>
  <div class="content" style="font-weight:bold;text-align:center;vertical-align:middle;">
    <div class="notice-detail">
      <div class="notice-detail-header">
        <div class="notice-detail-header-icon">
          <div class="user-icon" v-bind:style="{ backgroundImage: 'url(./static/image/img_logo.png)' }">
          </div>
        </div>
        <div class="notice-detail-header-info">
          시온 (SiON 운영자)
          <span class="date">{{ data.regDt | dateFormat }}</span>
        </div>
      </div>

      <div class="notice-detail-content">
        <div class="notice-detail-title">
          <span style="line-height: 20px;">[공지사항]</span>
        </div>
        <div class="notice-detail-body" v-html="data.conts"></div>
      </div>

      <div class="notice-detail-image" v-if="data.fileId > 0">
        <img :src="getImageUrl(data.fileId)">
      </div>
    </div>
  </div>
</template>

<script>
import { sendApi } from '@/api';

export default {
  data() {
    return {
      mtextId: 0,
      data: {},
    };
  },
  methods: {
    getImageUrl(file_id) {
      if (file_id && file_id != '') {
        return process.env.IMG_URL + "/view.php?id=" + file_id;
      } else {
        return "";
      }
    },
    getData() {
      const self = this;
      if (self.mtextId > 0) {
        let params = { mtextId: self.mtextId };
        sendApi('/notice/appView', params, (res) => {
          if (res.errCode && res.errCode == '9999') {
            self.$router.push({ path: '/timeLine/notice' });
          } else {
            self.data = res;
            console.log(self.data);
          }
        });
      }
    }
  },
  created() {
    const self = this;
    self.mtextId = self.$route.query.mtextId;
    self.$EventBus.$emit("setLogo", {
      type: "",
      text: "공지사항"
    });
  },
  mounted() {
    const self = this;
		self.getData();
  }
}
</script>
