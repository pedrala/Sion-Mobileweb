<template>
    <el-dialog :visible.sync="visibleGuide" class="mob modal modal-turms score-guide" 
     :show-close="true"     
     width="100%"
     top="0px" 
     :close-on-click-modal="true" 
     append-to-body>
      <template slot="title" >
         <div>
          <span class="el-dialog__title"><b>자동매매 유의사항</b></span>
        </div>   
      </template>
      <div class="section">
          	<ul>
							<li>1. 모든 주문은 서버를 통해 발동되기 때문에, 사용자가 취소하기 전까지는 계속 유지됩니다.</li>
							<li>2. 다른 주문 창에서 거래소 주문을 정정하거나 취소할 경우와 상관없이 전략의 신호에 의해 주문이 전송됩니다.</li>
							<li>3. 시스템을 이용하시기 전에 반드시 이용 방법을 숙지하시어 이용에 착오가 없으시기 바라며, 이 시스템은 매매주문을 내는 시스템일 뿐 시세 변동 또는 시장상황에 따라 실제 매매체결은 이루어지지 않을 수 있습니다.</li>
							<li>4. 자동주문 감시 시작 및 중단을 원칙적으로 사용자만 입력할 수 있지만 전산장애 등 주문불가 상황이 지속될 경우 당사는 등록조건을 모두 임의 해지 할 수 있습니다.</li>
							<li>5. 네트워크 장애, 천재지변, 사용자 모바일 환경, 유의사항 미숙지 등의 사유로 인해 정상적인 작동이 되지 않을 경우 발생한 손해는 당사에서 책임지지 않습니다.</li>
           	</ul>    
      </div>     

      <div slot="footer">
        <el-button-group  style="width:100%;height:55px" >
          <el-button @click="visibleGuide = false" type="primary" size="small" plain style="width:50%; height:55px;">취소 </el-button>
          <el-button @click="register" type="primary" size="small"  style="width:50%; height:55px; background-color: #007eef;">등록</el-button>          
        </el-button-group>    
      </div>
      
    
    </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      visibleGuide:false,
      strgData: []   

    };
  },
  props: [ 'straData' ],
  computed: {
    ...mapGetters(['isLoggedIn', 'getUserInfo'])
  },
  methods: {
    openRegisterGuide(val){
       const self = this;
       self.strgData = val
     //  console.log("val:"+JSON.stringify(val));      

       self.visibleGuide = true
    },
    register(){
        const self = this;

        let header = { trName: 'at313' }
          let input = {
            InBlock1: [{
              user_id: self.getUserInfo.user_id,  //사용자ID 
              strg_pack_seq: self.strgData.strg_pack_seq      //패키지전략키				       
            }] 
          }
          console.log("InBlock1:"+JSON.stringify(input));     
          self.$socket.sendProcessByName(header, input, function(queryData) {
            console.log("autoTradingRegister", queryData);
            if (queryData.queryObj) {
                let output = queryData.queryObj.OutBlock1[0];     
                if (output != null) {
                  if (output.rslt_cls == '1') {
                    //팝업창 닫기
                    self.visibleGuide = false
                    //등록후 운용중전략페이지 이동
                     self.$router.push({
                          name: "AutoTradingRunningStraDetail",
                          query: { straSeq:self.strgData.strg_pack_seq}                        
                    });      
                                      
                  } else {
                    self.$alert(output.rslt_msg, '', {
                      confirmButtonText: self.$t("common.confirm"),
                       callback: () => {
                         //팝업창 닫기
                        self.visibleGuide = false                        
                      }
                    });
                  }
                } else
                {
                self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
                  confirmButtonText: self.$t("common.confirm"),
                });
              }
            }
          });
    }
  },   
  created() {  
    const self = this;
    self.$EventBus.$on("openRegisterGuide", self.openRegisterGuide);
  },
  beforeDestroy() {
    const self = this;
    self.$EventBus.$off("openRegisterGuide", self.openRegisterGuide);

  }
}
</script>

<style lang="scss">
.mob.modal .el-dialog .el-dialog__body {
  padding: 0;
  height: calc(100% - 55px);
  background-color: #fff;
}

.el-dialog__footer {
    padding: 0;
}
</style>