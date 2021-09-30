<template>
  <div class="content" style="font-weight:bold;text-align:center;vertical-align:top;">
     <div style="overflow:hidden; padding:0 0 90px 0; overflow:auto;"  >
      <el-tabs v-model="activeName" :stretch="true" @tab-click="changeHandler" >
          <el-tab-pane label="충전" name="recharge" >
            <point-recharge></point-recharge>
          </el-tab-pane>
          <el-tab-pane label="환전" name='convert' lazy>
            <point-convert></point-convert>
          </el-tab-pane>
              <el-tab-pane label="수수료" name="fee" lazy >
            <point-fee></point-fee>
          </el-tab-pane>
          <el-tab-pane label="기타" name='etc' lazy >
            <point-etc></point-etc>
          </el-tab-pane>
      </el-tabs>
    </div>
<!--
    <div class="board-header">
      <md-tabs md-sync-route class="md-transparent"  md-alignment="fixed">
        <md-tab id="tab-recharge" to="/point/PointRecharge" md-label="충전"></md-tab>
        <md-tab id="tab-convert" to="/point/PointConvert" md-label="환전"></md-tab>
        <md-tab id="tab-fee" to="/point/PointFee" md-label="수수료"></md-tab>
        <md-tab id="tab-etc" to="/point/PointEtc" md-label="기타"></md-tab>
      </md-tabs>
    </div>

    <div class="board-content-body">
      <router-view></router-view>
    </div> -->

	</div>
</template>

<script>

import pointRecharge from "./PointRecharge.vue";
import pointConvert from "./PointConvert.vue";
import pointFee from "./PointFee.vue";
import pointEtc from "./PointEtc.vue";
export default {
  components: {
    pointRecharge,
    pointConvert,
    pointFee,
    pointEtc
  },
  data() {
    return {
    //  currenttab: "",
      activeName: "recharge"

    };
  },
  methods: {

    changeHandler (activeTab) {
				let self = this;
			  self.sendEvent();
    },
    sendEvent() {
      const self = this;
      if(self.activeTab == 'recharge') {
        self.$EventBus.$emit('pointRecharge');
      } else if(self.activeName == 'convert') {
        self.$EventBus.$emit('pointConvert')
      } else if(self.activeName == 'fee') {
        self.$EventBus.$emit('pointFee')
      } else if(self.activeName == 'etc') {
        self.$EventBus.$emit('pointEtc')
      }
    },
  },
  created() {
    const self = this;
    self.$EventBus.$emit("setLogo", {
      type: "",
      text: "포인트 관리"
    });
    self.$EventBus.$emit("setMenuIndex", "3-4");

  },
  mounted() {
  },
  beforeDestroy() {
  }
}
</script>
