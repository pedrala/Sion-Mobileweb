<template>
  <div style="width: 100%; height:100%; display:flex; flex-direction: column;">
    <div style="margin: 0 10px;">
      <div style="display: flex; margin-bottom: 2px;">
        <div v-if="symbol!=''" style="font-size:10px; padding:0 5px;flex:1;">
          <span style="line-height: 1.5em;font-size: 14px;color: #1453AF;"><b>{{ getSymbol(symbol).coincd+getSymbol(symbol).currency }}</b></span>
          <span>({{ getSymbol(symbol).vexidnm }})</span>
        </div>
        
        <div style="margin-right:5px;text-align: right;" :style="{flex: symbol==''?'1':'' }">
          <el-button plain size="mini" type="info" @click="dropCoin" :disabled="symbol==''"><i class="el-icon-delete"></i></el-button>
        </div>

        <div>
          <el-button-group>
            <el-button plain size="mini" type="info" @click="prevSymbol"><i class="el-icon-caret-left"></i></el-button>
            <el-button plain size="mini" type="info" @click="nextSymbol"><i class="el-icon-caret-right"></i></el-button>
          </el-button-group>
        </div>
      </div>
    </div>

    <div ref="chart" class="chart_cont_bx" style="flex:1;">
      <mini-chart v-if="symbol != ''" :symbol="symbol" :offset="offset" chartDivName="interest"></mini-chart>
      <div class="favorite-btn" v-else  @click="registerCoin" style="height:100%;">
        <p>관심 코인을 등록하세요.<br>(최대 3개 등록가능)</p>
      </div>
    </div>
  </div>
</template>

<script>
import MiniChart from '@/components/view/common/miniChart';
import { mapGetters } from "vuex";
export default {
  components: {
    MiniChart,
	},
  data() {
    return {
      symbol: '',
      coinCd: '',

      interCoinData: [],
      coinIndex: 0,
      totalCoinNo: 0,
      
      savedSymbol:'',

      offset: null,
    };
  },
  computed: {
    ...mapGetters([ "getUserInfo", "isMaster", 'getSymbol' ])
  },
  watch : {
    getUserInfo() {     
      const self = this;
      if (self.getUserInfo) {
        self.interCoinData = [];
        self.getInterCoin();
      } else {
        self.interCoinData = [];
      }
    },
  },
  methods: {
    prevSymbol() {
      const self = this;
      self.coinIndex--;
      if (self.coinIndex < 0) {
        self.coinIndex = 2;
      }
      self.alocation();
    },
    nextSymbol() {
      const self = this;
      self.coinIndex++;
      if (self.coinIndex > 2) {
        self.coinIndex = 0;
      }
      self.alocation();
    },
    alocation(){
      const self = this;
      self.symbol = self.interCoinData[self.coinIndex].symbol;
      self.coinCd = self.interCoinData[self.coinIndex].coin_cd;
    },
    showSavedItem(){
      const self = this;       
      const found = self.interCoinData.find(obj => obj.symbol == self.savedSymbol );
      console.log("found:"+JSON.stringify(found));

      self.symbol = found.symbol;
      self.coinCd = found.coin_cd;       

      self.savedSymbol = '';
    },
    //메뉴이동
    registerCoin(){
      const self = this;
      if (self.getUserInfo) {
        //저장된 코인 3개 이상인지 체크
        if (parseInt(self.totalCoinNo) >= 3 ) {
          self.$alert("저장된 코인이 3개 이상입니다.", '', {
             confirmButtonText: self.$t("common.confirm"),
          });
        } else {
          self.$router.push({
            name: "SiseList",
            query: {inter:"registerCoin"}
          });
        }
      } else {
        self.$alert("로그인 후에 등록가능합니다.", '', {
          confirmButtonText: self.$t("common.confirm"),
          callback: function() {
            self.$store.commit("setNeedLogin", true);
            self.$store.commit("setLoginCallbackUrl", 'interest');
          }
        });
      }
    },
    //삭제 콜백
    dropCallback(queryData) {
      const self = this;
      if (queryData.queryObj) {
        let output = queryData.queryObj.OutBlock1[0];
        if (output != null) {
          if (output.rslt_cls == '1') {
            self.interCoinData = [];
            //삭제성공시 리프레쉬
            self.getInterCoin();
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
    dropCoin() {
      const self = this;
      self.$EventBus.$emit('downChart');
      self.$confirm("해당 코인을 삭제하시겠습니까?", {
        confirmButtonText: self.$t("common.confirm"),
        cancelButtonText: self.$t("common.cancel"),
        dangerouslyUseHTMLString: true,
      }).then(() => {
        self.$EventBus.$emit('upChart');
        console.log("then");
        let header = { trName: 'at333' }
        let input = {
          InBlock1: [{
            gb: '2',    //0:조회 1:등록 2:삭제
            enc_user_id: self.getUserInfo.user_id,              //암호화된 ID
            symbol: self.symbol,  //심볼코드
            coin_cd: self.coinCd	//코인코드
          }]
        }
        console.log("input_at333:"+JSON.stringify(input));
        self.$socket.sendProcessByName(header, input, function(queryData) {
          console.log("dropCoin:", queryData);
          if (queryData != null) {
            self.dropCallback(queryData)
          }
        });

      }).catch(err => {
        self.$EventBus.$emit('upChart');
        console.log(err)
      });
    },
    // 관심코인리스트
    getInterCoin() {
      const self = this;
      let header = { trName: 'at333' }
      let input = {
        InBlock1: [{
          gb: '0',    //0:조회 1:등록 2:삭제
          enc_user_id: self.getUserInfo.user_id,  //암호화된 ID
          symbol: '',     //심볼코드
          coin_cd: ''			//코인코드
        }]
      }
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("getInterCoin", queryData);
        if (queryData != null) {
          if (queryData.queryObj) {
            let output = queryData.queryObj.OutBlock1[0];
            self.totalCoinNo = output.out_cnt
            if (output != null) {
              self.interCoinData = [];
              let blocks = queryData.queryObj.OutBlock2;
              for (var i = 0; i < 3; i++) {   //한도 3개
                self.interCoinData.push({
                  symbol: (blocks[i] == undefined)?'':blocks[i].symbol,
                  coin_cd: (blocks[i] == undefined)?'':blocks[i].coin_cd,
                })
                console.log("interCoinData:" + JSON.stringify(self.interCoinData[i]));
              }

              //저장한 아이템 보여주기
              if (self.savedSymbol != '') {
                self.showSavedItem();
              } else {
                self.alocation();
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
    setOffset() {
      const self = this;
      self.offset = {
        left: self.$refs.chart.offsetLeft+5,
        top: self.$refs.chart.offsetTop+45,
        width: self.$refs.chart.offsetWidth-10,
        height: self.$refs.chart.offsetHeight
      }
      console.log("setOffset", self.offset.left, self.offset.top, self.offset.width, self.offset.height);
    }
  },
  created() {
    const self = this;
    if (self.$route.params.symbol) {
      self.savedSymbol = self.$route.params.symbol;
    }
  },
  mounted() {
    const self = this;
    if (self.isMaster) {
      self.getInterCoin(); //관심코인조회
    }
    self.$EventBus.$on('loadMaster', self.getInterCoin);
    
    self.$nextTick(() => {
      self.setOffset();
    })
  },
  beforeDestroy() {
    const self = this;
    self.$EventBus.$off('loadMaster', self.getInterCoin);
  }
}
</script>
