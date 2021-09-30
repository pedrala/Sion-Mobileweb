<template>
	<div style="background-color: transparent;">
		<div class="search-box" style="padding: 20px 20px;text-align: center;background-color: transparent;">
      <el-row>
        <el-col style="margin-top: 15px;width: 50px;" align=left>
          <strong class="name">{{ $t('mypage.g006') }}</strong>
        </el-col>
        <el-col style="width: 100%;">
          <el-select v-model="market_cd" :placeholder="$t('mypage.g010')" class="select" style="width: 100%;"><!-- 거래소를 선택해주세요 -->
            <el-option v-for="item in markets" :key="item.exid_code" :label="item.exid_name" :value="item.exid_code"></el-option>
          </el-select>
        </el-col>
        <!--바코드 스캐너-->
        <!-- <div>          
            <el-col style="width: 100%;margin-top:20px; text-align: center;">
              <el-button type="primary" style="width:150px; height:40px; margin-bottom:10px" @click="goQRcode">QRcode스캔 </el-button>   
            </el-col>           
        </div> -->
         <!-- Binance 전용 QR코드--> 
         <div v-if="market_cd=='021'">
          
            <el-col style="width: 100%;margin-top:20px; text-align: center;">
              <el-button type="primary" style="width:150px; height:40px; margin-bottom:10px" @click="goQRcode">QRcode스캔 </el-button>   
            </el-col>  
         
        </div>
        <!-- OKEX 전용 QR코드-->
        <div v-else-if="market_cd=='020'">
            
          <el-col style="width: 100%;margin-top:20px; text-align: center;">
            <el-button type="primary" style="width:150px; height:40px; margin-bottom:10px" @click="goQRcode">QRcode스캔 </el-button>   
          </el-col>           
        </div>
         <!-- Upbit 전용 -->
        <div v-else-if="market_cd=='019'">
         
        </div>       
        <!-- 비트멕스 전용 -->
        <div v-else-if="market_cd=='001'">
          
        </div>       
        <!-- 비트멕스 테스트넷 전용 -->
        <div v-else-if="market_cd=='901'">
         
        </div>       
        <!-- Binance 테스트넷 전용 -->
        <div v-else-if="market_cd=='921'">
          
        </div>       
        <!-- FTX 전용 -->
        <div v-else-if="market_cd=='100'">
          
        </div>       
         <!-- 빗썸 전용 -->
        <div v-else-if="market_cd=='101'">
          
        </div>  
        <div v-else>       
          
        </div>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col style="margin-top: 15px;width: 80px;" align=left>
           <!-- 업빗 -->
          <div v-if="market_cd=='019'"> 
            <strong class="name">Access Key</strong>       
          </div>  
          <!-- 빗썸 -->
          <!-- <div v-else-if="market_cd=='921'" >   
            <strong class="name">Connect Key</strong>       
          </div> -->
          <div v-else>
            <strong class="name">API Key</strong>       
          </div>           
        </el-col>
         <el-col style="margin-top: 15px;width: 80px;" align=left>     

        </el-col>
        <el-col style="width: 100%;margin-left: 0px;">
          <el-input title="API Key" :placeholder="$t('mypage.g001')" v-model="public_key" class="input" style="width: 100%;" clearable></el-input><!-- API Key를 입력하세요 -->
        </el-col>
        <el-col style="margin-top: 15px;width: 80px;" align=left>
          <strong class="name">Secret Key</strong>
        </el-col>
        <el-col style="width: 100%;margin-left: 0px;">
          <el-input title="Secret Key" :placeholder="$t('mypage.g002')" v-model="private_key" class="input" style="width: 100%;" clearable></el-input><!-- Secret Key를 입력하세요 -->
        </el-col>

        <div v-if="market_cd=='020'">
          <el-col style="margin-top: 15px;width: 110px;" align=left>
            <strong class="name">Passphrase</strong>
          </el-col>
          <el-col style="width: 100%; text-align: left;">
            <el-input title="Passphrase" :placeholder="$t('mypage.g012')" v-model="passphrase" class="input" style="width: 100%;" clearable></el-input>
          </el-col>     
        </div>
      </el-row>
		</div>

    <el-row>
      <el-col :span="24">
        <div style="margin-bottom:50px" align=center>
          <el-button type=primary style="width:300px;height:40px;"  @click="goRegister">등록</el-button>                    
        </div>
      </el-col>    
    </el-row>

    <el-row>
      <el-col :span="24">
        <div style="margin-bottom:50px" align=center>
            {{marketFormat(market_cd)}}
            <el-link @click="goApiGuide(marketFormat(market_cd))"  :underline="false">API 등록가이드 ></el-link>
        </div>
      </el-col>    
    </el-row>   
  
    <el-row :gutter="20" style="margin-left: 10px;margin-bottom: 20px;">
      <el-col v-if="market_cd=='019'" :span="24">   <!-- 업빗 -->
        <div style="color: red;">＊ {{ $t('mypage.g014') }}<!-- 아래의 IP를 허용IP 주소로 등록해주세요. --></div>
        <div style="color: red; margin-left:20px">{{ upbitAcceptableIP1 }}</div>
        <div style="color: red; margin-left:20px">{{ upbitAcceptableIP2 }}</div>
      </el-col>
    </el-row>

      <api-guide></api-guide>
      <qrcode-reader></qrcode-reader>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import Vue from 'vue'
import ApiGuide from './ApiGuide'
import QrcodeReader from './QrcodeReader'

export default {
  computed: {
    ...mapGetters(['getUserInfo', 'isSocketConnected'])
  },
  data() {
    return {    

      market_cd: '',
      public_key: '',
      private_key: '',
      passphrase: '',
      markets: [],
      list: [],
      
      upbitAcceptableIP1: '',
      upbitAcceptableIP2: '',
      resultData: []    
    };
  },
  components: {   
    ApiGuide,
    QrcodeReader
  },
 
  methods: {
     marketFormat(val) {
      const self = this;
  //    console.log("markets:"+JSON.stringify(self.markets));
      if (val) {      
        var tmp = self.markets.filter(item => item.exid_code == val);
        if (tmp.length > 0) {
         // console.log("exid_name:"+tmp.exid_name)
          return tmp[0].exid_name;
        } else {
          return val;
        }
      }
      return "";
    },

   	goApiGuide(val) {
      const self = this;
      console.log("goApiGuide");
      let url = "";
      if (val == "BINANCE") {
        url = "https://www.binance.com/kr/support/faq/360002502072";
        window.open(url);
      } else if (val == "BITMEX") {
        url = "https://www.bitmex.com/app/apiKeys";
        window.open(url);
      } else if (val == "UPBIT") {
        url = "https://upbit.com/mypage/open_api_management";
        window.open(url);
      } else
      {
        self.$EventBus.$emit("openApiGuide", null);
      }
     
    },
    validateApiKey() {
      const self = this;
      if (self.market_cd == '') {
        // 거래소를 선택해주세요
        self.$alert(self.$t('mypage.g010'), '', {
          confirmButtonText: self.$t("common.confirm"),
        });
      } else if (self.public_key == '') {
        // API Key를 입력해주세요
        self.$alert(self.$t('mypage.g001'), '', {
          confirmButtonText: self.$t("common.confirm"),
        });
      } else if (self.private_key == '') {
        // Secret Key를 입력해주세요
        self.$alert(self.$t('mypage.g002'), '', {
          confirmButtonText: self.$t("common.confirm"),
        });
      } else if (self.market_cd == '020' && self.passphrase == '') {
        // passphrase를 입력해주세요
        self.$alert(self.$t('mypage.g012'), '', {
          confirmButtonText: self.$t("common.confirm"),
        });
      } else {
        return true;
      }
      return false;
    },
    goQRcode(){
      const self = this;
      //  self.$EventBus.$emit("openQRcodeScanner", null);      
      window.QRScanner.prepare(self.onDone);
      // window.QRScanner.show();
      // window.QRScanner.scan(self.displayContents);

    },  
    onDone(err, status){
      console.log("qrcode onDone:"+status);
      const self = this;
        if (err) {
            // here we can handle errors and clean up any loose ends.
            console.error(err);
        }
        if (status.authorized) {
            // W00t, you have camera access and the scanner is initialized.
            window.QRScanner.show(function(status){
              console.log("qrcode status:"+status);
              // window.document.body.style.backgroundColor = 'transparent';
              window.QRScanner.scan(self.displayContents);
            });
        } else if (status.denied) {
            // The video preview will remain black, and scanning is disabled. We can
            // try to ask the user to change their mind, but we'll have to send them
            // to their device settings with `QRScanner.openSettings()`.
        } else {
            // we didn't get permission, but we didn't get permanently denied. (On
            // Android, a denial isn't permanent unless the user checks the "Don't
            // ask again" box.) We can ask again at the next relevant opportunity.
        }
    },
    displayContents(err, text){
      const self = this;
      var json = JSON.parse(text);
      if(err){
          // an error occurred, or the scan was canceled (error code `6`)
          alert("err:"+text);
      } else {
          // The scan completed, display the contents of the QR code:
          // alert(text);          
          Vue.prototype
            .$confirm('', "API Key를 사용하시겠습니까?", {
              confirmButtonText: "사용",
              cancelButtonText: "취소"
            })
            .then(() => {
              setTimeout(() => {
                self.public_key = json.apiKey;
                self.private_key = json.secretKey;
              }, 500);

            })
            .catch(() => {
              window.QRScanner.destroy();
            });
          
      }
    },
    //거래소 등록 콜백
    registerCallback(queryData) {
      const self = this;
   //   window.QRScanner.destroy();
      if (queryData.queryObj) {
        let output = queryData.queryObj.OutBlock1[0];
        if (output != null) {
          if (output.rslt_cls == '1') {   
            //등록성공시 거래소목록으로 이동
            self.$router.push('/profile/api/Api');	          
          } else {
            let rslt_msg = output.rslt_msg;
            self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
              confirmButtonText: self.$t("common.confirm"),
              dangerouslyUseHTMLString: true
            });
          }
        }
      } else {
        self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
          confirmButtonText: self.$t("common.confirm"),
        });
      }

      self.market_cd = "";
      self.public_key = "";
      self.private_key = "";
      self.passphrase = "";
    },
    //거래소 등록
    goRegister() {
      const self = this;
     
      if (self.validateApiKey()) {
        let header = {
          trName: 'at082'
        }
        let input = {
          InBlock1: [{
            enc_user_id: self.getUserInfo.user_id,
            proc_gb: '0',
            market_cd: self.market_cd,
            public_key: self.public_key,
            private_key: self.private_key,
            passpharese: self.passphrase
          }]
        }
         console.log("at082_input:", input);
        self.$socket.sendProcessByName(header, input, function(queryData) {
          console.log("goRegister", queryData);
          if (queryData != null) {
            self.registerCallback(queryData);
          }
        });
      }
    },

  
    //거래소 조회 콜백
    loadMasterCallback(queryData) {
      const self = this;
      if (queryData.queryObj) {
        let output = queryData.queryObj.OutBlock1[0];
        if (output != null) {
          if (output.rslt_cls == '1') {
            self.markets = queryData.queryObj.OutBlock2;
         //   console.log("markets:"+JSON.stringify(self.markets));
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
    //거래소 조회
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
    getData() {
      const self = this;
      self.loadMaster(); //거래소 조회      
    },
    //API 키, 시크릿키 받아옴
    getApiSecretKey(val) 
    {   
      const self = this;
      self.$nextTick(function() {      
        //인풋박스 채움
        self.public_key = val.apiKey;
        self.private_key = val.secretKey;      
       });  
    }
  },
  created() {
    const self = this;    
    self.$EventBus.$emit("setLogo", {
      type: "",
      text: "API 등록" 
    });   

    if (process.env.BUILD_ENV == 'dev') {
      self.upbitAcceptableIP1 = '211.240.103.80 / 211.240.103.81';
      self.upbitAcceptableIP2 = '211.240.103.85 / 211.240.103.86';
    }

    self.$EventBus.$on("getApiSecretKey", self.getApiSecretKey);    
  },
  mounted() {
    const self = this;
    if (self.isSocketConnected) {
      self.getData();
    } else {
      self.$EventBus.$on('socketConnected', self.getData);
    }
  },
  beforeDestroy() {
    const self = this;
    self.$EventBus.$off('socketConnected', self.getData);
    self.$EventBus.$off("getApiSecretKey", self.getApiSecretKey);
  }
}
</script>
