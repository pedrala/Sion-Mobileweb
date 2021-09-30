<template>
  <div class="content">

    <div class="board-header">
      <md-tabs md-sync-route class="md-transparent" md-alignment="fixed">
        <md-tab id="tab-interest" to="/home/interest" md-label="관 심"></md-tab>
        <md-tab id="tab-home" to="/home/taste" md-label="맛보기"></md-tab>
        <md-tab id="tab-profitRate" to="/home/profitRate" md-label="수익률"></md-tab>
        <md-tab id="tab-info" to="/home/info" md-label="정 보"></md-tab>
      </md-tabs>
    </div>

    <div class="board-content-body">
      <flash></flash>
      <router-view></router-view>
    </div>

	</div>
</template>

<script>
import flash from "./flash";

export default {
  data() {
    return {

    };
  },
  components:{
    flash
  },
  methods: {
  },
  created() {
    const self = this;
    self.$EventBus.$emit("setLogo", {
      type: "home",
      text: "홈"
    });
    self.$EventBus.$emit("setMenuIndex", "0");
  },
  mounted() {
  },
  beforeDestroy() {
  }
}
</script>
