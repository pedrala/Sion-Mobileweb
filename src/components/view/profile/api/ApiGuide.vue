<template>
    <el-dialog :visible.sync="visibleGuide" class="mob modal modal-turms score-guide" 
    width="100%" 
    top="0px" 
    :close-on-click-modal="true" 
    append-to-body>
      <template slot="title">
        <div >
          <span class="el-dialog__title">API 등록 가이드</span>         
        </div>
      </template>
      <div class="section" style="padding-bottom: 0;">
        <!-- <div v-html="data.conts" class="terms"></div> -->
        	<ul>
							<li>1. 모든 주문은 서버를 통해 발동되기 때문에, 사용자가 취소하기 전까지는 계속 유지됩니다.</li>
							<li>2. 다른 주문 창에서 거래소 주문을 정정하거나 취소할 경우와 상관없이 전략의 신호에 의해 주문이 전송됩니다.</li>
							<li>3. 시스템을 이용하시기 전에 반드시 이용 방법을 숙지하시어 이용에 착오가 없으시기 바라며, 이 시스템은 매매주문을 내는 시스템일 뿐 시세 변동 또는 시장상황에 따라 실제 매매체결은 이루어지지 않을 수 있습니다.</li>
							<li>4. 자동주문 감시 시작 및 중단을 원칙적으로 사용자만 입력할 수 있지만 전산장애 등 주문불가 상황이 지속될 경우 당사는 등록조건을 모두 임의 해지 할 수 있습니다.</li>
							<li>5. 네트워크 장애, 천재지변, 사용자 모바일 환경, 유의사항 미숙지 등의 사유로 인해 정상적인 작동이 되지 않을 경우 발생한 손해는 당사에서 책임지지 않습니다.</li>            
						</ul>
      </div>     

      <div slot="footer" >
           <el-button @click="visibleGuide = false" class="button button-bg03 block">{{ $t("common.confirm") }}</el-button>
      </div>

    </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      visibleGuide:false

    };
  },
  methods: {
    openApiGuide(){
       const self = this;
       self.visibleGuide = true

    }
  },  
  mounted() {   

  },
  created() {  
    const self = this;
    self.$EventBus.$on("openApiGuide", self.openApiGuide);
  },
  beforeDestroy() {
    const self = this;
    self.$EventBus.$off("openApiGuide", self.openApiGuide);

  }
}
</script>
