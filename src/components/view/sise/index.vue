<template>
  <div class="content">
    <div class="board-header" :style="{display: tabVisible ? 'block':'none' }" >
      <md-tabs md-sync-route class="md-transparent" md-alignment="fixed">
        <md-tab id="tab-home" to="/sise/list" md-label="시 세" ></md-tab>
        <md-tab id="tab-diag" to="/sise/diagnosis" md-label="진 단"></md-tab>
        <md-tab id="tab-comp" to="/sise/compare" md-label="비 교"></md-tab>
      </md-tabs>
    </div>
    <div class="board-content-body" :style="{paddingTop: tabVisible ? '40px' :'0px' }">
      <router-view></router-view>
    </div>
  </div>

</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      tabVisible: true
    }
  },
  computed: {
  },
  methods: {
    hideTab() {
      const self = this;
      self.tabVisible = false
    }
  },
  created() {
    const self = this;
    self.$store.commit("setCurrentExid", "");
    self.$store.commit("setCurrentCoin", "");
    self.$EventBus.$on('hideTab', self.hideTab);
  },
  beforeDestroy() {
    const self = this;
    self.$EventBus.$off('hideTab', self.hideTab);
  }
}
</script>
