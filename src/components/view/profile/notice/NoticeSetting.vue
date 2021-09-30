<template>
   <div class="content" style="font-weight:bold;vertical-align:middle;">
  	<div class="section">		

      <div style="margin-top:20px;margin-left:20px;">
          <el-row  >    
            <el-col :span='15'>   
                공지사항 알림   
            </el-col>    
            <el-col :span='9'>
              <el-switch v-model="noticeYn" active-text="ON" inactive-text="OFF" @change="setNoticeSetting"></el-switch>    
            </el-col> 
          </el-row>
          <el-row>        
            <el-col :span='15'>                      
                마케팅 정보 수신 알림    
            </el-col>    
            <el-col :span='9'>         
              <el-switch v-model="marketingYn" active-text="ON" inactive-text="OFF" @change="setNoticeSetting"></el-switch> 
            </el-col>
          </el-row>
          <el-row >   
            <el-col :span='15'>                          
              체결 알림   
            </el-col>    
            <el-col :span='9'>      
              <el-switch v-model="orderYn" active-text="ON" inactive-text="OFF" @change="setNoticeSetting"></el-switch> 
          </el-col>   
          </el-row>
      </div>

       <div style="margin-top:50px;margin-left:0px;">
          <el-row  >    
              <el-col :span='5'>  
                시간설정     
              </el-col>
              <el-col :span='19'>            
              
                  <el-time-select 
                      :disabled="timeDisabled" 
                      start-placeholder="시작 시간"
                      v-model="startTm"  
                      :picker-options="{
                        start: '00:00',
                        step: '00:05',
                        end: '23:59'                   
                      }"
                      style="width:45%" 
                     >                  
                  </el-time-select>
                  <span class="demonstration"> ~ </span>
                     <el-time-select 
                      :disabled="timeDisabled" 
                      end-placeholder="종료 시간"
                      v-model="endTm"  
                      :picker-options="{
                        start: '00:00',
                        step: '00:05',
                        end: '23:59',
                        minTime: startTm             
                      }"
                      style="width:45%"
                    >                  
                  </el-time-select>

                  <!-- <el-time-picker 
                    is-range                 
                    range-separator="~"
                    start-placeholder="시작 시간"
                    end-placeholder="종료 시간"
                    :disabled="timeDisabled" 
                    v-model="Tm"  
                    format = "HH:mm"
                    :picker-options="{
                      start: '00:00',
                      step: '00:05',
                      end: '24:00',
                      minTime: Tm[0]
                    }"                   
                    style="width:100%">
                  </el-time-picker>               -->
              </el-col>
          </el-row>           
        </div>

     </div>
   </div>

</template>

<script>
import { mapGetters } from "vuex";
import moment from 'moment'

export default {
  computed: {
    ...mapGetters(['getUserInfo', 'isSocketConnected'])
  },
  data() {
    return {
      timeDisabled: false,

      noticeYn:false,
      marketingYn:false,
      orderYn:false,

      startTm:'00:00',
      endTm:'23:59',

     // Tm: ['', '']


    };
  },
  methods: { 
    
    //알림 설정 저장
    setNoticeSetting(){
      const self = this;       

     if(self.orderYn == false)
      {
        self.timeDisabled = true
      }
      else
      {
        self.timeDisabled = false
      }
      

      let startTm = self.startTm.split(":");
      startTm = startTm[0] + startTm[1];

      let endTm = self.endTm.split(":");
      endTm = endTm[0] + endTm[1];

      // let startTm =moment(self.Tm[0]).format('HHmm');
      // let endTm = moment(self.Tm[1]).format('HHmm');
   
      let header = { trName: 'at321' }
      let input = {
        InBlock1: [{
          		
          enc_user_id	: self.getUserInfo.user_id,  //고객ID				 
          gubun		: 1,               //구분(0:조회/1:수정)				
          notice_yn	: (self.noticeYn == true)?'Y':'N',      //공지사항알림(Y/N)								
          marketing_yn	:(self.marketingYn== true)?'Y':'N',      //마케팅 정보수신알림(Y/N)				
          order_yn	:(self.orderYn== true)?'Y':'N',      //체결알림(Y/N)					
          start_tm	: (self.orderYn == false)? '' : startTm,      //시작시간					
          end_tm	: (self.orderYn == false)? '': endTm     //끝시간			

        }] 
      }      
      console.log("setNoticeSetting_InBlock1:"+JSON.stringify(input));
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("setNoticeSetting", queryData);
        if (queryData != null) {
          if (queryData.queryObj) {
            let output = queryData.queryObj.OutBlock1[0];     
            if (output != null) {
              if (output.rslt_cls == '1') {
                  //self.getNoticeSetting();
                
              } else {
                self.$alert("알림설정중 오류가 발생했습니다.잠시 후 다시 실행해 주세요.", '', {
                  confirmButtonText: self.$t("common.confirm")
                });
              }
            }    
           
          } else {
            self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
              confirmButtonText: self.$t("common.confirm")
            });
          }
        }
      });
    },    
    //시간불러오기
    convertTime(val){
        const self = this;    

        self.startTm = val.start_tm.substr(0,2)+':'+ val.start_tm.substr(2,2)  
        self.endTm = val.end_tm.substr(0,2)+':'+ val.end_tm.substr(2,2) 

        // self.Tm[0].setHours(parseInt(val.start_tm.substr(0,2))) //숫자 0~23
        // self.Tm[0].setMinutes(parseInt(val.start_tm.substr(2,2)))  //숫자 0~59
        // self.Tm[1].setHours(parseInt(val.end_tm.substr(0,2))) 
        // self.Tm[1].setMinutes(parseInt(val.end_tm.substr(2,2))) 

    },    

    getNoticeSettingCallback(queryData) {
        const self = this;             
				if (queryData.queryObj) {
					let output = queryData.queryObj.OutBlock1[0];
					if (output != null) {
						if (output.rslt_cls == '1') {
              
              self.noticeYn	= (output.notice_yn)=='Y'?true:false;      //공지사항알림(Y/N)								
              self.marketingYn = (output.marketing_yn)=='Y'?true:false	;      //마케팅 정보수신알림(Y/N)				
              self.orderYn = (output.order_yn)=='Y'?true:false	;      //체결알림(Y/N)	

              self.convertTime(output);
          

						} else {
							let rslt_msg = output.rslt_msg;
							self.$alert(rslt_msg, '', {
								confirmButtonText: self.$t('common.confirm')
							});
						}
					}
				} else {
					self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
						confirmButtonText: self.$t("common.confirm"),
					});
				}

		},
    //알림 설정 조회
    getNoticeSetting(){
      const self = this;      
   
      let header = { trName: 'at321' }
      let input = {
        InBlock1: [{
          		
          enc_user_id	: self.getUserInfo.user_id,  //고객ID				 
          gubun		: 0,               //구분(0:조회/1:수정)				
          notice_yn	: '',      //공지사항알림(Y/N)								
          marketing_yn	:'',      //마케팅 정보수신알림(Y/N)				
          order_yn	:'',      //체결알림(Y/N)					
          start_tm	:'',      //시작시간					
          end_tm	:''      //끝시간			

        }] 
      }      
      console.log("getNoticeSetting_InBlock1:"+JSON.stringify(input));
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("getNoticeSetting", queryData);
        if (queryData != null) {
          self.getNoticeSettingCallback(queryData);
        }
      });
    }
            
  },
  created() {
    const self = this;    
    self.$EventBus.$emit("setLogo", {
      type: "",
      text: "알림 설정" 
    });  

    // self.Tm[0] = new Date();//moment(); // 당일
    // self.Tm[1] = new Date();
    // self.Tm[1].setHours(self.Tm[0].getHours() + 1);  // moment().add(1, "hours"); // 한시간뒤

  },
  mounted() {
    const self = this; 

    if (self.isSocketConnected) {
     self.getNoticeSetting();
    } else {
      self.$EventBus.$on('socketConnected', self.getNoticeSetting);
    }
  },
  destroyed() {
    const self = this;
    self.$EventBus.$off('socketConnected', self.getNoticeSetting);
  }

}
</script>
<style>
  .el-row {
    margin-bottom: 20px;  
  }
</style>
