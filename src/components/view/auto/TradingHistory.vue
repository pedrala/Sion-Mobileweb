<template>
<div class="content product-detail">
    <div width="100%" top="0" class="mob modal modal-type03" append-to-body>
       <div slot="title" class="modal-head product-detail-head">  
            <div class="product-detail-head-img">
                  <div class="pro-icon-img" v-bind:style="{ backgroundImage: 'url(' + expertImage(strgData.strg_pack_seq,strgData.logo_key) + ')'}">
                  </div>
            </div>
            <div class="product-info">           
            <div class="badges">	                 				
              <strong :class="colorProfitRate(strgData.profit_rate)">{{ strgData.profit_rate | numberFormat2 }} %</strong>
            </div>
            <strong class="title">{{strgData.strg_market_nm }}</strong>
            <div class="etc">
              <span class="space">{{ strgData.exid }} / {{ strgData.jong_cd }}</span>		
            </div>   		
        </div>        
    </div>    

       <el-table :data="tradingHistoryData" :empty-text="emptyText" ref="tableRef" :show-header="true"  
       :header-row-style="headerStyle"   
       :cell-style="{padding: '0px', height: '55px'}" 
       style="width:100%;margin-top: 0;">
          <el-table-column label="종목/일시" width="155" header-align="center">
            <template  slot-scope="scope" >
               <div class="etc">               
                 {{ scope.row.jong_nm }}<br> {{ scope.row.datetime | dateFormat }}
                </div>                	
            </template>
          </el-table-column>
          <el-table-column label="수량/가격" width="140" header-align="center" align="center">
             <template   slot-scope="scope">		
                 <div class="etc" >               
                 {{ scope.row.che_qty| numberFormat2 }}<br> {{ scope.row.price | numberFormat2 }} 
                </div>    
            </template>
          </el-table-column>         
          <el-table-column label="구분" width="50" header-align="center">
            <template slot-scope="scope">            
                <div  class="etc">               
                 	<span :class="(scope.row.side)=='매수' ? 'num color02' : 'num color03'">{{ scope.row.side }}</span>
                </div>              
            </template>
          </el-table-column>
        </el-table>

		<infinite-loading v-if="isInfinite" spinner="spiral" ref="infiniteLoading" @infinite="infiniteHandler">
			<div slot="no-more"></div>
			<div slot="no-results"></div>
		</infinite-loading>
  </div>
</div>
</template>

<script>
import { mapGetters } from "vuex";
import InfiniteLoading from 'vue-infinite-loading';

export default {
  components: {
     InfiniteLoading
  },
  computed: {
    ...mapGetters(['getUserInfo', 'isSocketConnected'])
  },
  data() {
    return {
      isInfinite: false,      
      strgData: [],
      strgKey: '',
           
      tradingHistoryData: [], 
      emptyText:'거래내역이 없습니다.',        
      loading: '',
      currentPage: 1,
      pageSize: 20,
      total: 0,   

    };
  },
  filters:
  {
    statFormat(val){
      const self = this;
      if(val=='S')
      {
        return '실행대기'
        
      }else if(val=='A')
      {
        return '실행중'

      }else if(val=='X')
      {
        return '실행불가'
      }

    }
  },
  methods: {    
    expertImage(seq,id) {  //로고키가 빈값인 데이터가 2개 이상일 때 duplcate key 에러발생
     // console.log("expertImage_id_seq:"+seq,id)
      if (id) {       
        return process.env.IMG_URL + "/view.php?id=" + id;
      } else {
        return require("@/images/coinImage/basic/default.png");
      }
    },

    colorProfitRate(val){    
        if(parseFloat(val)>0.00)
        {
            return  'num color02'
        }else if(parseFloat(val)<0.00)
        {
            return 'num color03'
        }else
        {
            return 'num color07'
        } 
    },

    headerStyle(row, rowIndex){
      return 'font-size:12px;color:black'
    },
 
    //거래내역
    infiniteHandler($state) {
      const self = this;     
      let header = { trName: 'at317' }
      let input = {
        InBlock1: [{
          enc_user_id: self.getUserInfo.user_id,  //사용자ID  '69p*59Q4F}', 
          strg_pack_seq: self.strgKey,     //패키지전략키			'PKG20200923000000001'	    
          page_no	: self.currentPage,     //페이지번호				
          page_div_cnt	: self.pageSize    //페이지분할건수				
        }] 
      }
      console.log("at317_input:"+JSON.stringify(input))
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("infiniteHandler_at317", queryData);        
        if (queryData != null) {
          if (queryData.queryObj) {
                    
            let output = queryData.queryObj.OutBlock1[0];
            self.total = parseInt(queryData.queryObj.OutBlock1[0].out_cnt);

            if (output != null) {
              if (output.rslt_cls == '1') {

                if (output.out_cnt * 1 > 0) {
                    let tmpList = queryData.queryObj.OutBlock2;
                    if (tmpList.length > 0) {    
                        self.tradingHistoryData = self.tradingHistoryData.concat(tmpList);                              
                    }                  
                    self.currentPage += 1;
                    $state.loaded();
                
                } else {
                   $state.complete();
                }

              } else {
                let rslt_msg = output.rslt_msg;
                self.$alert(rslt_msg, '', {
                  confirmButtonText: self.$t("common.confirm")
                });
                $state.complete();
              }
            }
             
             
          } else {
            self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
              confirmButtonText: self.$t("common.confirm"),
            });
            $state.complete();
          }
        }
      });
    },
    //운용전략리스트 조회
    getStraDetail() {
      const self = this;
      console.log("getStraDetail start");

      let userId = '';
      if(self.getUserInfo != null)
      {
          userId = self.getUserInfo.user_id; //'iZxE:d2iOo' //
      }
      let header = { trName: 'at316' }
      let input = {
        InBlock1: [{
          enc_user_id	:userId, //self.getUserInfo.user_id, //사용자ID
          strg_pack_seq :self.strgKey

        }]
      }

      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("getRunningStra:", queryData);
        if (queryData != null) {
          if (queryData.queryObj) {
            let output = queryData.queryObj.OutBlock1[0];

            if (output != null) {
              if (output.rslt_cls == '1') {

                self.strgData = queryData.queryObj.OutBlock2[0];     

                if (self.isInfinite) {
                  self.tradingHistoryData = [];
                  self.currentPage = 1;        
                  self.$refs.infiniteLoading.stateChanger.reset();
                } else {
                  self.isInfinite = true;          
                }  
              
              } else {
                let rslt_msg = output.rslt_msg;
                self.$alert(rslt_msg, '', {
                  confirmButtonText: self.$t("common.confirm")
                });

              }
            }
          } else {
            self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
              confirmButtonText: self.$t("common.confirm"),
            });
          }
        }
      });
    },
    getData() {
      const self = this;  
      self.getStraDetail();   
     
    },    
    changeLangType() {
      const self = this;
      self.$EventBus.$emit("setLogo", { type: "", text: self.$t('ranking.a001') });
      self.getStraDetail();    
    },
    
    reset() {
      const self = this;
      self.strgData = [];    

      isInfinite = false,      
      
      self.tradingHistoryData = [];     
      self.loading = '';
      self.currentPage = 1;
      self.pageSize = 20;
      self.total= 0;
    }

  },
  mounted(){    
    const self = this;        
       
    if (self.isSocketConnected) {
      self.getData();		
    } else {
      self.$EventBus.$on('socketConnected', self.getData);
    }        

  },
  created() {
    const self = this;  
    self.strgKey = self.$route.query.straSeq;
    // console.log("strgKey:" + self.strgKey);         
    self.$EventBus.$on("changeLangType", self.changeLangType);
    
    self.$EventBus.$emit("setLogo", {
      type: "",
      text: "거래내역" //self.$t('expert.a001')
    });
   
    self.$EventBus.$emit("setMenuIndex", "2-3-1");
    self.$EventBus.$on("reset", self.reset);  

  },
  beforeDestroy() {
    const self = this;
    self.$EventBus.$off('socketConnected', self.getData);    
    self.$EventBus.$off("changeLangType", self.changeLangType);
    self.$EventBus.$off("reset", self.reset);  
  }

}
</script>
