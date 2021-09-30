<template>
  <div class="content" style="font-weight:bold;text-align:center;vertical-align:middle;">
  	<div class="section">		

      	<div v-if="!seen"  align=center>

            <el-row align="center">
                API 키를 등록해 주세요.       
            </el-row>     
            <el-row style="margin-top:50px" align="center">                             
                <el-button type=primary style="width:300px;height:30px;"  @click="register">+</el-button>            
            </el-row>       

            <el-row :gutter="20" style="margin-top:50px" align="center"   >
              <el-col :span="24">
                <div style="color: red;">＊ {{ $t('mypage.g013') }}<!-- API Key 는 거래소당 1개만 등록이 가능합니다. --></div>
              </el-col>
            </el-row>      		
        
			  </div>
        <div v-else>

          <el-table :data="ApiListData" border :show-header="false" class="table">    
            <el-table-column prop="signal_name" header-align="right">
              <template slot-scope="scope">               
                  <div class="product-info">
<<<<<<< .mine
                    <div class="badges">							
                       <span class="dropdown2">                  
                        <el-dropdown  size="small" @command="handleCommand(scope.row.exid_code, scope.row.public_key)">
                          <el-button type="primary" size="small">
||||||| .r16627
                    <div class="badges">							
                       <span class="dropdown" style="height:100%;" >                  
                        <el-dropdown @command="handleCommand(scope.row.exid_code, scope.row.public_key)">
                          <el-button type="primary">
=======
                    <div class="badges">
                      <span class="dropdown2">
                        <el-button type="danger" size="mini" @click="handleCommand(scope.row.exid_code, scope.row.public_key)">삭제</el-button>
                        <!-- <el-dropdown  size="small" @command="handleCommand(scope.row.exid_code, scope.row.public_key)">
                          <el-button type="primary" size="small">
>>>>>>> .r16840
                            <i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item icon="el-icon-check">삭제</el-dropdown-item>                   
                          </el-dropdown-menu>
                        </el-dropdown> -->
                      </span>
                    </div>

                    <strong class="title">
                      {{ scope.row.exid_nm }} 
                      <span v-if="scope.row.use_gb== 'Y'"><!-- 정상 -->
                        <span :class="'badge badge-bg04'" style="width:15px;height:15px"></span>
                      </span>
                      <span v-if="scope.row.use_gb== 'N'"><!-- 오류 -->
                        <span :class="'badge badge-bg05'" style="width:15px;height:15px"></span>
                      </span>
                    </strong>
                  
                    <div class="etc" style="margin-top:10px;">                  
                      <span class="space"> {{ scope.row.public_key |apiKeyFormat }}</span>
                      <br>                   
                      <div v-if="scope.row.use_gb== 'N'">
                        <span style="color: red;">{{ errorMsg }}</span>
                      </div>
                   
                    </div>              
                  </div>               
              </template>
            </el-table-column>
          </el-table>       

          <el-row style="margin-top:50px;">                             
              <el-button type=primary style="width:300px;height:40px;"  @click="register">+</el-button>            
          </el-row>

        </div>           

      <div  v-if="seen" align="left">
          <el-row style="margin-top:50px;margin-left:10px;" >                             
              <span :class="'badge badge-bg05'" style="width:15px;height:15px"></span> 오류 -  다시 등록하세요.    
          </el-row>
          <el-row style="margin-top:50px;margin-left:10px;">                             
              <span :class="'badge badge-bg04'" style="width:15px;height:15px"></span> 정상 -  사용가능    
          </el-row>
      </div>

			
			</div>
	</div>
</template>
<script>

import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(['getUserInfo', 'isSocketConnected'])
  },
  data() {
    return {    
       seen: false,
       errorMsg:"API KEY에 오류가 확인되었습니다. 키 정보 또는 권한을 다시 확인하고 재등록해주세요.",
       markets: [],
       ApiListData: []     
    };
  },
  filters: {
    apiKeyFormat(apiKey) {
      if (apiKey) {
        if (apiKey.length >= 8) {
          return apiKey.substring(0, 4) + "****" + apiKey.substring(apiKey.length - 4, apiKey.length);
        } else {
          return apiKey;
        }
      }
      return "";
    }
  },
  methods: {
    
    marketFormat(val) {
      const self = this;
      console.log("markets:"+self.markets);
      if (val) {      
        var tmp = self.markets.filter(item => item.exid_code == val);
        if (tmp.length > 0) {
          console.log("exid_name:"+tmp.exid_name)
          return tmp[0].exid_name;
        } else {
          return val;
        }
      }
      return "";
    },
    
    register(){
      const self = this;  
      self.$router.push('/profile/api/apiRegister');	

    },    
    handleCommand(exid_code, public_key) {
      const self = this; 
      self.goDelete(exid_code, public_key);
    },
    //거래소목록 조회 콜백
    loadMasterCallback(queryData) {
      const self = this;
      if (queryData.queryObj) {
        let output = queryData.queryObj.OutBlock1[0];
        if (output != null) {
          if (output.rslt_cls == '1') {
            self.markets = queryData.queryObj.OutBlock2;
            // console.log(self.markets);
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
    },
    //거래소목록 조회
    loadMaster() {
      const self = this;
      let header = {
        trName: 'at069'
      }
      let input = {
        InBlock1: [{
          dummy: '',
        }]
      }
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("loadMaster", queryData);
        if (queryData != null) {
          self.loadMasterCallback(queryData);
        }
      });
    },
    deleteCallback(queryData) {
      const self = this;
      if (queryData.queryObj) {
        let output = queryData.queryObj.OutBlock1[0];
        if (output != null) {
          if (output.rslt_cls == '1') {
            self.getApiKeyList();
          } else {
            let rslt_msg = output.rslt_msg;
            self.$alert(rslt_msg, '', {
              confirmButtonText: self.$t("common.confirm"),
              callback: action => {
                self.getApiKeyList();
              }
            });
          }
        }
      } else {
        self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
          confirmButtonText: self.$t("common.confirm"),
        });
      }
    },
    goDelete(market_cd, public_key) {
      const self = this;
      // 삭제하시겠습니까?
      self.$confirm("API KEY를 삭제하시겠습니까? <br>삭제 시 현재 실행 중인 자동매매는 중지됩니다.", {     //self.$t('mypage.g011')
        confirmButtonText: self.$t("common.confirm"),
        cancelButtonText: self.$t("common.cancel"),
        dangerouslyUseHTMLString: true,
      }).then(() => {
        let header = {
          trName: 'at082'
        }
        let input = {
          InBlock1: [{
            enc_user_id: self.getUserInfo.user_id,
            proc_gb: '1',
            market_cd: market_cd,
            public_key: public_key,
            private_key: ''
          }]
        }
        self.$socket.sendProcessByName(header, input, function(queryData) {
          console.log("goDelete", queryData);
          if (queryData != null) {
            self.deleteCallback(queryData);
          }
        });
      }).catch(err => console.log(err));
    },
    listCallback(queryData) {
      const self = this;
      if (queryData.queryObj) {
        let output = queryData.queryObj.OutBlock1[0];
        if (output != null) {
          if (output.rslt_cls == '1') {
            let out = queryData.queryObj.OutBlock1[0].out_cnt	
            if (parseInt(out) > 0) {
              self.seen = true;
            } else {
              self.seen = false;
            }
            self.ApiListData = queryData.queryObj.OutBlock2;
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
    },
    //등록된 API key 조회
    getApiKeyList() {
      const self = this;
      let header = {
        trName: 'at320'
      }
      let input = {
        InBlock1: [{
          enc_user_id: self.getUserInfo.user_id
        }]
      }
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("getApiKeyList", queryData);
        if (queryData != null) {
          self.listCallback(queryData);
        }
      });
    },
    getData() {
      const self = this;  
      self.loadMaster();   //거래소목록 조회
      self.getApiKeyList();  // 등록된 API key 조회
    },

  },
  created() {
    const self = this;  
    self.$EventBus.$emit("setLogo", {
      type: "",
      text: "API 관리" 
    });
    self.$EventBus.$emit("setMenuIndex", "3-3");
  },
  mounted() {
    const self = this;  
    if (self.isSocketConnected) {
      self.getData();
    }
    self.$EventBus.$on('socketConnected', self.getData);
  },
  beforeDestroy() {
    const self = this;  
    self.$EventBus.$off('socketConnected', self.getData);
  }
}
</script>
