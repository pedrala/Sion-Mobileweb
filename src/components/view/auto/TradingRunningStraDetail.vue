<template>
<div class="content product-detail" >		   
      <div width="100%" top="0" class="mob modal modal-type03" append-to-body>
         <div slot="title" class="modal-head product-detail-head">          
              <div class="product-detail-head-img">
                 <div class="pro-icon-img" v-bind:style="{ backgroundImage: 'url(' + expertImage(strgData.strg_pack_seq,strgData.logo_key) + ')'}">
                 </div>     
              </div>     
            	<div class="product-info">           
                <div class="badges">	           
                  <div v-if="strgData.status== 'X'"><!-- 실행불가 -->
                    <span :class="'badge badge-bg01'">{{ strgData.status| statFormat }}</span>
                  </div>
                  <div v-if="strgData.status== 'S'"><!-- 실행대기 -->
                    <span :class="'badge badge-bg02'">{{ strgData.status| statFormat }}</span>
                  </div>
                  <div v-if="strgData.status== 'A'"><!-- 실행중 -->
                    <span :class="'badge badge-bg03'">{{ strgData.status| statFormat }}</span>
                  </div>           				
                  <strong :class="colorProfitRate(strgData.profit_rate)">
                     <span>{{ strgData.profit_rate | numberFormat2 }}%</span>
                  </strong>
              </div>
              <strong class="title">{{ strgData.strg_market_nm }}</strong>
              <div class="etc">
                <span class="space">                  
                  {{ strgData.exid }} / {{ strgData.jong_cd }}
                </span>
                <span class="dropdown">
                  <el-button type="danger" size="mini" @click="handleCommand">삭제</el-button>
                  <!-- <el-dropdown size="small" @command="handleCommand">
                    <el-button type="primary" size="small">
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item icon="el-icon-check">삭제</el-dropdown-item>                   
                    </el-dropdown-menu>
                  </el-dropdown> -->
                </span>	                      
              </div>   	
         </div>         
      </div>      
    
      <br>
      
      <div class="heading depth01" style="width:100%;margin: 15px 0px 5px 10px;">
         <table style="width:90%;">
            <colgroup>
              <col style="width:35%">
              <col style="width:30%">   
              <col style="width:35%">                
            </colgroup>          
            <tbody>
              <tr> 
                <td>
                  <h2 class="title">실행/정지</h2>   
                </td>
                <td align="right">
                    <span v-if="seen">       
                      <el-popover placement="right-start" width="300" title="도움말" trigger="hover">
                        <span style="color:red" >1. 아래 API 오류 사유에 해당할 경우 자동매매가 중지되고 재실행이 불가합니다</span>
                        <p>- API KEY 삭제로 인하여 API KEY 값이 유효하지 않을 수 있습니다.</p> 
                        <p>- API KEY 권한 변경으로 주문이 불가할 수 있습니다.</p>     
                        <p> > API KEY 정보를 다시 확인해주세요.</p>    
                        <span style="color:red" >2. 포인트 부족 </span>
                        <p>- 포인트가 자동매매 최소 포인트보다 작을 경우 실행이 불가합니다.</p>             
                        <p> > 포인트를 충전해주세요.</p>     
                        <span slot="reference"><i class="el-icon-info"></i>실행불가</span>
                      </el-popover>
                    </span >  
                </td>
                <td align="right">
                   <el-switch v-model="set_f" active-text="ON" inactive-text="OFF" @change="runStopOrder"></el-switch>    
                </td>
              </tr>
            </tbody>
         </table>     
      </div>     
      
      <div class="heading depth01" style="margin: 15px 0px 5px 10px;">
        <h2 class="title"> 이용조건</h2>
      </div>

      <div class="line-box02">       
          <table style="font-size:12px; width:100%;">
            <colgroup>
              <col style="width:23%">
              <col style="width:19%">   
              <col style="width:23%">
              <col style="width:35%">                   
            </colgroup>          
            <tbody>
              <tr style="height:50px"> 
                <td>최소포인트:</td>
                <td>{{ pointAssetData.limit_p | numberFormat }} P</td>
                <td>보유포인트:</td>
                <td>
                  <span :class="parseInt(pointAssetData.limit_p) > parseInt(pointAssetData.point) ? 'num color02' : 'num color03'"> 
                    <b>{{ pointAssetData.point | numberFormat }}</b>
                  </span> P
                </td>
              </tr>
              <tr>               
                <td>최소자산:</td>
                <td>{{ pointAssetData.limit_asset | numberFormat2}} {{ pointAssetData.unit }}</td>
                <td>보유자산:</td>
                <td>
                  <span :class="parseInt(pointAssetData.limit_asset) > parseInt(pointAssetData.marginbalance) ? 'num color02' : 'num color03'">
                    <b>{{ pointAssetData.marginbalance | numberFormat2 }}</b>
                  </span> {{ pointAssetData.unit }}
                </td>
              </tr>
            </tbody>
          </table>
      </div>

       <div class="heading depth01" style="margin: 25px 0px 5px 10px;">
        <h2 class="title"> 자산 </h2> 
        <span >         
          <el-radio-group v-model="assetGb" size=mini @change="gbChange">
            <el-radio-button label="1">금액</el-radio-button>
            <el-radio-button label="2">수량</el-radio-button>
          </el-radio-group>    
        </span>      
      </div>

      <div class="line-box02" >       
        <table style="width:100%;font-size:12px;">
          <colgroup>
            <col style="width:50%">
            <col style="width:50%">
          </colgroup>          
          <tbody>
            <tr style="height:60px"> 
              <td>수익금<br>
                <span :class="(parseFloat(assetData.profits) > 0.0) ? 'num color02' : 'num color03'">
                <b>{{ assetData.profits | numberFormat }}</b>
                </span> {{ assetData.unit }}
              </td>
              <td>수익률<br>
                <span :class="(parseFloat(assetData.profit_rate) > 0.0) ? 'num color02' : 'num color03'">
                  <b>{{ assetData.profit_rate | numberFormat2 }}</b>
                </span> %
              </td>
            </tr>
            <tr>
              <td>현재 가치<br>
                <b>{{ assetData.cur_val | numberFormat }}</b> {{ assetData.unit }}
              </td>         
              <td>시작시 가치<br>
                <b>{{ assetData.start_val | numberFormat }}</b> {{assetData.unit}}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="heading depth01" style="margin: 15px 0px 5px 10px;">
        <h2 class="title"> 수익률</h2> 
        <span>
          <el-radio-group v-model="profitGb" size=mini @change="gbChange">
            <el-radio-button label="0">7일</el-radio-button>
            <el-radio-button label="1">30일</el-radio-button>
            <el-radio-button label="2">60일</el-radio-button>
          </el-radio-group>          
        </span>    
        <span>
          <el-popover placement="right-start" width="250" title="" trigger="hover">
            <p>매일 오전 9시 잔고 기준으로 일별 수익률이 계산됩니다.</p>
            <p>입출금이 일어날 경우 수익률이 왜곡될 수 있습니다.</p>          
             <span slot="reference"><i class="el-icon-info"></i></span>
          </el-popover>
        </span>      
      </div>

      <!-- 실적차트 -->
      <div class="clear" style="margin: 15px; 15px;">
        <div width="100%" style="height: 200px; border: 1px solid #dadada">
           <expert-record  :yieldData="yielddata" :gb='1'></expert-record>
        </div>
      </div>

      <div class="heading depth01" style="margin: 15px 0px 5px 10px;">
        <h2 class="title"> 포지션</h2>
      </div>

      <div class="line-box02">       
        <table style="width:100%; font-size:12px;">
          <colgroup>
            <col style="width:20%">
            <col style="width:40%">   
            <col style="width:40%">                        
          </colgroup>          
          <tbody>
            <tr style="height:50px"> 
              <td>종목<br>
                <b>{{ positionData.jong_nm }}</b>
              </td>                     
              <td>평균진입가<br>
                <b>{{ positionData.avg_in_price | numberFormat2 }}</b>
              </td>   
              <td>수량<br>
                <b>{{ positionData.quantity	| numberFormat2 }}</b> 
              </td>
            </tr>
            <tr>               
              <td>수익률<br>
                <span :class="(parseFloat(positionData.profit_rate) > 0.0) ? 'num color02' : 'num color03'"> 
                  <b>{{ positionData.profit_rate	| numberFormat2	}}%</b>
                </span>
              </td>
              
              <td>투자금액<br>
                <b>{{ positionData.tuja_amt	| numberFormat2	}}</b>
              </td>

              <td>수익금<br>
                <span :class="(parseFloat(positionData.profits) > 0.0) ? 'num color02' : 'num color03'">
                  <b>{{ positionData.profits	| numberFormat2 }}</b>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="heading depth01" style="margin: 25px 0px 5px 10px;">
        <el-row>
          <el-col :span="12">
            <h2 class="title"> 거래내역 </h2>   
          </el-col> 
          <el-col :span="12" align=right >     
            <!-- 챠트보기 추후 구현 -->
            <!-- <el-button type="primary" size="small" @click="seeChart"  style="margin-right:10px;width:100px;height:40px">챠트보기
              <i class="el-icon-data-analysis el-icon--right"></i>
            </el-button> -->
           </el-col>
        </el-row>
      </div>

      <div>      
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
                 {{ scope.row.che_qty | numberFormat2}}<br> {{ scope.row.price | numberFormat2 }} 
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

        <!-- 거래내역 더보기 - 데이터가 있을 경우에만 버튼 보이기-->
        <div v-if="(parseInt(total) > 0)" align=center>    
            <el-button type=primary style="width:100px;height:40px" @click="historyDetail">더보기</el-button>
        </div>
      
      </div>

       <!-- 전략설명 -->
      <div class="heading depth01" style="margin: 25px 0px 5px 10px;">
        <h2 class="title"> 전략소개 </h2>             
      </div>
      <div class="msg-text" style="margin-top: 0px;margin-bottom: 60px;">
        <p class="sub-text">{{ pointAssetData.strg_info | removeTags}}</p>
      </div>

    </div>
</div>
</template>

<script>
import { mapGetters } from "vuex";
import ExpertRecord from "../auto/SignalExpertRecord";
import TradingHistory from "../auto/TradingHistory";
import MobileDetect from "mobile-detect";
export default {
   components: {
     ExpertRecord,
     TradingHistory
   },   
   data() {
    return {     
      //팝업 데이타
      tabValue: '1',
      tradingRunningStraDetailVisible: false,

      strgKey: '',
      strgData: [],
    
      strgInfo:'',          
      
      //도움말 노출 여부
      seen:false,
      
      //보유포인트, 보유자산
      pointAssetData: [],        
      assetData:[],

      //성과분석(수익률 그래프)     
      yielddata: [],
      assetGb: '1', //1.금액 2.수량
      profitGb: '0', //0:7일,1.30일,2.60일
     
      //실행/정지
      set_f: false,
     
      //포지션조회
      positionData:[],
      //거래내역리스트   
      tradingHistoryData: [],  
      emptyText:'거래내역이 없습니다.',
      upGb: '1', //포인트갱신(1:O 0:X)	       
      currentPage: 1,
      pageSize: 20,
      total: 0,
     
    };
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'getUserInfo', 'isSocketConnected'])
  },
  watch: {
    isLoggedIn(val, old) {
      if (val) {
        const self = this;      
        self.getUseCondition();       
      }
    }
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
     expertImage(seq,id) {
      if (id) {
       // console.log("expertImage_id_seq:"+seq,id)
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
    //삭제버튼 클릭
    handleCommand() {
      const self = this;    
      if (self.strgData.status== 'A') {
        //현재 전략 실행 중 일 경우 
        self.$alert("현재 전략이 실행 중 입니다. 전략 기동을 일시정지 한 후 삭제해주세요", '', {
          confirmButtonText: self.$t("common.confirm")
        });
      } else if(self.strgData.status== 'X' || self.strgData.status== 'S') {
        //현재 전략 중지/대기중일 경우 일 경우
        self.deleteStra();
      }
    },
    deleteStra(){
      const self = this;    
        self.$confirm('전략을 삭제하시겠습니까?', {
            confirmButtonText: '확인',
            cancelButtonText: '취소',
            center: true,
            type: 'warning'
        }).then(() => {    
            const self = this;      
          let header = {
            trName: 'at312'
          }
          
          let input = {
            InBlock1: [{    
              user_id	: self.getUserInfo.user_id,  //사용자ID       
              strg_pack_seq	: self.strgData.strg_pack_seq   //패키지전략키		           
            }]
          }

          self.$socket.sendProcessByName(header, input, function (queryData) {
            console.log(queryData);
            if (queryData != null) {
              if (queryData.queryObj) {             
                self.rsltClsDetail = parseInt(queryData.queryObj.OutBlock1[0].rslt_cls);                                 
                if (self.rsltClsDetail == "1") {
                  self.$alert("전략이 삭제되었습니다.", '', {
                    confirmButtonText: '확인',
                    callback: action => {
                      self.$router.push('/auto/trading');
                    }
                  });
                }    
              } else {
                let header = queryData.header;
                if (header) {
                  self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
                    confirmButtonText: self.$t("common.confirm"),
                  });
                }
              }
            }
          });          
      })
      .catch(err => console.log(err))    
    },
    //풀스크린 로딩표시
    loading(){
        const self = this;    
        //실행대기 상태인 경우 전체화면 로딩바 출력
        if(self.strgData.status== 'S')
        {         
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          setTimeout(() => {
            loading.close();
          }, 2000);
        }
    },
    //실행,정지 
    runStopOrder(){
      const self = this;    
      self.loading();
   
      let header = { trName: 'at311' }
      let input = {
        InBlock1: [{
          status	: self.set_f?'1':'0',      //상태변경값 0: 중지 1:시작				
          user_id: self.getUserInfo.user_id,  //사용자ID 
          strg_pack_seq: self.strgData.strg_pack_seq      //패키지전략키		
        }] 
      }      
      console.log("runStopOrder_InBlock1:"+JSON.stringify(input));
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("runStopOrder", queryData);
        if (queryData != null) {
          if (queryData.queryObj) {
            let output = queryData.queryObj.OutBlock1[0];     
            if (output != null) {
              if (output.rslt_cls == '1') {
                //전략실행/정지 상태 다시 조회
                self.getStraDetail()              
                
              } else {
                self.$alert(output.rslt_msg, '', { //전략 실행 중 오류가 발생했습니다.잠시 후 다시 실행 해 주세요.

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
    
    //이용조건 (보유포인트, 보유자산, 최소포인트, 최소자산)
    getUseCondition() {
      const self = this;
      let header = { trName: 'at314' }
      let input = {
        InBlock1: [{
          user_id: self.getUserInfo.user_id,  //사용자ID 
          strg_pack_seq: self.strgData.strg_pack_seq      //패키지전략키				     
        }] 
      }
      console.log("getUseCondition_input_at314:"+JSON.stringify(input));
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("getUseCondition", queryData);
        if (queryData != null) {
          if (queryData.queryObj) {         

            self.pointAssetData = queryData.queryObj.OutBlock1[0];   
            if(self.pointAssetData.rslt_cls == '1')
            {              
              //"APIKEY사용여부  'N' : 미등록상태"				            
              if(self.pointAssetData.apikey_gb	== 'N') 
              {      

                  self.$confirm('API Key 가 등록되지 않았습니다.<br> 설정페이지로 이동하시겠습니까?', '', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    dangerouslyUseHTMLString: true                
                  }).then(() => {
                    self.$router.push('/profile/api/api');	
                  }).catch(err => console.log(err))  

                  // self.$alert("API Key 를 다시 확인해주세요.", '', {
                  //   confirmButtonText: 'API 설정페이지로 이동',//self.$t("common.confirm")
                  //   showClose:true,
                  //   closeOnClickModal: false,
                  //   callback: action => {
                  //      self.$router.push('/profile/api/api');	
                  //   }
                  // });     
                          
              }else if(self.pointAssetData.apikey_gb	== 'Y')  // 'Y' : 등록되어있음
              {
                  //최소포인트 요건 불충족 
                  if(parseInt(self.pointAssetData.point) < parseInt(self.pointAssetData.limit_p)	 )
                  {
                      self.$confirm('포인트가 부족합니다.<br> 포인트 충전페이지로 이동하시겠습니까?', '', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        dangerouslyUseHTMLString: true                
                      }).then(() => {
                        self.$router.push('/profile/point/point');		
                        
                      }).catch(err => console.log(err))                      
                  }
                  else
                  {             
                      //최소자산 요건 불충족
                      if(parseInt(self.pointAssetData.marginbalance) < parseInt(self.pointAssetData.limit_asset	))
                      {   
                            self.$confirm('자산이 부족합니다.<br> 프로필 페이지로 이동하시겠습니까?', '', {
                              confirmButtonText: 'OK',
                              cancelButtonText: 'Cancel',
                              dangerouslyUseHTMLString: true                
                            }).then(() => {
                              self.$router.push('/profile/main');	
                            }).catch(err => console.log(err))       
                      }                                
                  }        
              }    
            } else {
              let rslt_msg = self.pointAssetData.rslt_msg;
              self.$alert(rslt_msg, '', {
                confirmButtonText: self.$t("common.confirm")
              });
            }

          } else {
            self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
              confirmButtonText: self.$t("common.confirm"),
            });
          }
        }
      });
    },

    //옵션 변경시 자산 재조회
    gbChange(){
       const self = this;
       self.getMyAsset();
    },

    //자산 , 수익률(그래프)
    getMyAsset() {
      const self = this;
      let header = { trName: 'at318' }
      let input = {
        InBlock1: [{
          enc_user_id: self.getUserInfo.user_id,  //사용자ID 
          strg_pack_seq: self.strgData.strg_pack_seq,     //패키지전략키				    
          asset_gb: self.assetGb,     //자산버튼구분(1:금액/2:수량)
          profit_gb: self.profitGb    //수익률버튼구분(0:7일/1:30일/2:60일)
        }] 
      }
      console.log("input_at318:" + JSON.stringify(input));  
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("getMyAsset", queryData);
        if (queryData != null) {
          if (queryData.queryObj) {
             self.assetData = queryData.queryObj.OutBlock1[0];       
             self.yielddata = queryData.queryObj.OutBlock2;        
             self.yielddata = self.yielddata.slice(0, 60)             
          } else {
            self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
              confirmButtonText: self.$t("common.confirm"),
            });
          }
        }
      });
    },
    //포지션
    getMyPosition() {
      const self = this;
      let header = { trName: 'at319' }
      let input = {
        InBlock1: [{
          enc_user_id: self.getUserInfo.user_id,  //사용자ID 
          strg_pack_seq: self.strgData.strg_pack_seq,     //패키지전략키				    
          asset_gb: self.assetGb,     //자산버튼구분(1:금액/2:수량)
          up_gb	: self.upGb    //포인트갱신(1:O 0:X)				
        }] 
      }
      console.log("input_at319:" + JSON.stringify(input));  
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("getMyPosition", queryData);
        if (queryData != null) {
          if (queryData.queryObj) {
            self.positionData = queryData.queryObj.OutBlock1[0];          
          } else {
            self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
              confirmButtonText: self.$t("common.confirm"),
            });
          }
        }
      });
    },
    //챠트보기
    seeChart(){
      const self = this;
      let symolcode = self.strgData.precode + self.strgData.jong_cd//종목
      console.log("symolcode:"+symolcode)
      self.$router.push({
          name: "SisePrice",
          params: self.strgData,
          query: {
            symbol: symolcode
          }       
      });
    },
    //거래내역 상세페이지 이동
    historyDetail(){
       const self = this;
       self.$router.push({
            name: "AutoTradingHistory",
            query: { straSeq:self.strgData.strg_pack_seq}        
       });        

    },
    //거래내역
    getMyTradingHistory() {
      const self = this;     
      let header = { trName: 'at317' }
      let input = {
        InBlock1: [{
          enc_user_id: self.getUserInfo.user_id,  //사용자ID  '69p*59Q4F}'
          strg_pack_seq: self.strgData.strg_pack_seq,     //패키지전략키		 'PKG20200923000000001'		    
          page_no	: self.currentPage,     //페이지번호				
          page_div_cnt	: self.pageSize    //페이지분할건수				
        }] 
      }
      console.log("input_at317:" + JSON.stringify(input));  
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("getMyTradingHistory", queryData);        
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
    //운용전략 상세조회
    getStraDetail() {
      const self = this;
      console.log("getStraDetail start");

      let userId = '';
      if(self.getUserInfo != null)
      {
          userId = self.getUserInfo.user_id;
      }
      let header = { trName: 'at316' }
      let input = {
        InBlock1: [{
          enc_user_id	:userId,  //사용자ID
          strg_pack_seq :self.strgKey
        }]
      }

      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("getStraDetail:", queryData);
        if (queryData != null) {
          if (queryData.queryObj) {
            let output = queryData.queryObj.OutBlock1[0];

            if (output != null) {
              if (output.rslt_cls == '1') {

                  self.strgData = queryData.queryObj.OutBlock2[0];        
                  self.getData();
              
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
               
      self.$EventBus.$emit("setLogo", {
          type: "",
          text: "운용중 전략"  //self.strgData.strg_market_nm + ' (운용중)'
      });

      //실행중 표시 (디폴트 off)
      if(self.strgData.status == 'A')
      {
          self.set_f = true
      }

      //실행불가일 경우 안내확인창, 도움말노출
      if( self.strgData.status== 'X')
      {            
          self.seen = true
      }

      self.getUseCondition(); //보유포인트,자산조회   
      self.getMyAsset();  //자산, 수익률 그래프 조회
      self.getMyPosition();  //포지션조회
      self.getMyTradingHistory(); // 거래내역
    
    },
      
    changeLangType() {
      const self = this;
      self.getStraDetail();
      
    }
  },
  created() {
    const self = this;
    self.strgKey = self.$route.query.straSeq;
    console.log("strgKey:" + self.strgKey);    

    self.$EventBus.$on("changeLangType", self.changeLangType);
  
    self.$EventBus.$emit("setMenuIndex", "2-3");
  },
  mounted() {   
    const self = this;
    if (self.isSocketConnected) {
      self.getStraDetail();
    }
    self.$EventBus.$on('socketConnected', self.getStraDetail);
  },
  beforeDestroy() {
    const self = this; 
    self.$EventBus.$off("changeLangType", self.changeLangType);

    self.$EventBus.$off('socketConnected', self.getStraDetail);
  }  
}
</script>
<style>

  .image {
    border-radius: 100%;
    width: 100%;
    display: block;
  }
  </style>
