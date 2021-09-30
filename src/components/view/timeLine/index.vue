<template>
  <div class="content" style="font-weight:bold;text-align:center;vertical-align:middle;">
    <div class="board-header" v-bind:class="{ 'header-shadow': scTop }">
      <md-tabs md-sync-route class="md-transparent" md-alignment="fixed">
        <template slot="md-tab" slot-scope="{ tab }">
          {{ tab.label }}
          <i class="badge" v-if="tab.data.count">{{ tab.data.count }}</i>
        </template>
        <md-tab id="tab-home" to="/timeLine/notice" md-label="공지사항"></md-tab>
        <md-tab id="tab-pages" to="/timeLine/push" md-label="PUSH 알림" :md-template-data="{ count: newCnt }"></md-tab>
      </md-tabs>
    </div>

    <div class="board-content-body">
      <router-view></router-view>
    </div>
	</div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      tabIndex: "0",
      newCnt: 0,
      scTop: false
    };
  },
  computed: {
    ...mapGetters([ "getUserInfo", "isLoggedIn", "isSocketConnected" ])
  },
  methods: {
    handleTabClick(val1, val2, val3) {
      const self = this;
      if (self.tabIndex == '0') {
			  self.$router.push('/timeLine/notice');
      } else {
        self.$router.push('/timeLine/push');
      }
    },
    handleScroll (event) {
      const self = this;
      self.scTop = window.scrollY > 0;
    },
    getData() {
      const self = this;
      if (self.isLoggedIn) {
        let header = { trName: 'at323' };
        let input = {
          InBlock1: [{
            enc_user_id: self.getUserInfo.user_id,
          }]
        }
        self.$socket.sendProcessByName(header, input, function(queryData) {
          if (queryData) {
            if (queryData.queryObj) {
              self.newCnt = queryData.queryObj.OutBlock1[0].new_cnt * 1;
            } else {
              console.error(queryData.header);
            }
          } else {
            console.error("at323 is null");
          }
        });
      }
    },
    resetNewCnt() {
      const self = this;
      self.newCnt = 0;
    },
  },
  created() {
    const self = this;
    self.$EventBus.$emit("setLogo", {
      type: "",
      text: "타임라인" //self.$t('expert.a001')
    });
    self.$EventBus.$emit("setMenuIndex", "4");
    if (self.$route.name == 'TimeLineNotice') {
      self.tabIndex = '0';
    } else if (self.$route.name == 'TimeLinePush') {
      self.tabIndex = '1';
    }
    window.addEventListener('scroll', self.handleScroll);
  },
  mounted() {
    const self = this;
    if (self.isSocketConnected) {
      self.getData();
    }
    self.$EventBus.$on('socketConnected', self.getData);
    self.$EventBus.$on('resetNewCnt', self.resetNewCnt);
  },
  beforeDestroy() {
    const self = this;
    self.$EventBus.$off('resetNewCnt', self.resetNewCnt);
    self.$EventBus.$off('socketConnected', self.getData);
    window.removeEventListener("scroll", self.handleScroll);
  }
}
</script>
