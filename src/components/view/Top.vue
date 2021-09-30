<template>
  <div v-show="topList.length > 0" class="top-banner" style="height:40px;padding:0 0;">
    <el-carousel :interval="5000">
      <el-carousel-item v-for="(item, index) in topList" :key="'0'+index">
        <el-image style="max-width:100%; height: 40px;" :src="item.name" @click="goPage(item.link)"></el-image>
      </el-carousel-item>
    </el-carousel>
    
    <div class="right">
      <el-button class="btn-close el-icon-close" @click="closeTop"></el-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  data() {
    return {
      tIndex: 0,
      topList: [],
    };
  },
  methods: {
    getTopBanner() {
      const self = this;
      self.topList = [
        { name: self.$t('top.a001m'), link: 'https://bit.ly/lot-sion-banner' }
      ];

      if (self.topList.length > 0) {
        //self.$EventBus.$emit("TopBanner", true);
      }
    },

    leftTop() {
      const self = this;
      self.$refs.top.prev();
      self.tIndex = self.$refs.top.activeIndex;
    },
    rightTop() {
      const self = this;
      self.$refs.top.next();
      self.tIndex = self.$refs.top.activeIndex;
    },
    closeTop() {
      const self = this;
      self.$cookies.set("SIGNALMAKER_closeTop", moment().format('YYYYMMDD'), '1D');
      self.topList = [];
      self.$EventBus.$emit("TopBanner", false);
    },
    goPage(url) {
      window.open(url, url);
    },
    changeLangType() {
      const self = this;
      if (self.topList.length > 0) {
       // self.getTopBanner();
      }
    }
  },
  created() {
    const self = this;
    let cookieTop = self.$cookies.get("SIGNALMAKER_closeTop");
    if (!cookieTop || cookieTop !== moment().format('YYYYMMDD')) {
     // self.getTopBanner();
      self.$EventBus.$on("changeLangType", self.changeLangType);
    }
  },
  beforeDestroy() {
    const self = this;
    self.$EventBus.$off("changeLangType", self.changeLangType);
  }
}
</script>
