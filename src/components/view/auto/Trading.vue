<template>
  <div class="content">

    <div style="display: flex; justify-content: flex-end; background-color:rgba(0,0,0, .05);" >
      <el-button  style="padding:0 10px; margin:5px 0" >
       [사용법] >       
        <span class="link" @click="goLink()">
            <img style="width:50px;" src="../../../../static/image/youtube-icon.png" alt="Youtube" />
        </span>
      </el-button>
    </div>

    <div class="auto-trade-wrap">
      <div class="auto-trade-list" v-if="runningStraVisible">
        <h3 class="auto-trade-title">
          자동매매 운용중
        </h3>

        <el-table :data="runningStraData" ref="tableRef" :show-header="false" :empty-text="emptyText" class="table"
          :cell-style="{padding: '0px', height: '50px'}"
          style="margin-top: 0;">
          <el-table-column width="80">
            <template slot-scope="scope">
              <div class="pro-icon-img" v-bind:style="{ backgroundImage: 'url(' + expertImage(scope.row.strg_pack_seq,scope.row.logo_key) + ')'}">
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="signal_name" @click="goDetailViewOnRunningStra(scope.row)" header-align="right"><!--최근 30일 수익률-->
            <template slot-scope="scope">
              <div v-wave @click="goDetailViewOnRunningStra(scope.row)">
                <div class="product-info">
                  <div class="badges">
                    <div v-if="scope.row.status== 'X'"><!-- 실행불가 -->
                      <span :class="'badge badge-bg01'">{{ scope.row.status| statFormat }}</span>
                    </div>
                    <div v-if="scope.row.status== 'S'"><!-- 실행대기 -->
                      <span :class="'badge badge-bg02'">{{ scope.row.status| statFormat }}</span>
                    </div>
                    <div v-if="scope.row.status== 'A'"><!-- 실행중 -->
                      <span :class="'badge badge-bg03'">{{ scope.row.status| statFormat }}</span>
                    </div>
                    <strong :class="colorProfitRate(scope.row.profit_rate)">
                      <span>{{ scope.row.profit_rate | numberFormat3 }}%</span>
                    </strong>
                  </div>
                  <strong class="title">{{ scope.row.strg_market_nm }}</strong>
                  <div class="etc">
                    <span class="space"><!-- {{ $t("ranking.a009-1") }} 거래소 --> {{ scope.row.exid }}</span>
                    <span class="space"><!-- {{ $t("ranking.a009-3") }} 종목명 --> {{ scope.row.jong_cd }}</span>
                    <!-- <p class="product-info-desc">
                      {{ scope.row.strg_info | removeTags}}
                    </p> -->
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="auto-trade-list">
        <h3 class="auto-trade-title">
          자동매매 전략
          <span>최근 30일 수익률</span>
        </h3>

        <el-table :data="availStraData" ref="tableRef" :show-header="false" class="table"
        :header-row-style="headerStyle"
         :cell-style="{padding: '0px', height: '55px'}"
        style="margin-top: 0px;margin-bottom: 60px;">
          <el-table-column width="80">
            <template slot="header" slot-scope="scope">
              <span>로고</span>
            </template>
            <template slot-scope="scope">
              <div class="pro-icon-img" v-bind:style="{ backgroundImage: 'url(' + expertImage(scope.row.strg_pack_seq,scope.row.logo_key) + ')'}">
               </div>
            </template>
          </el-table-column>
          <el-table-column prop="signal_name" label="최근 30일 수익률" @click="goDetailViewOnAvailStra(scope.row)" header-align="right"><!--최근 30일 수익률-->
            <template slot-scope="scope">
              <div v-wave @click="goDetailViewOnAvailStra(scope.row)">
                <div class="product-info">
                  <div class="badges">
                    <strong :class="colorProfitRate(scope.row.profit_rate)">
                      <span>{{ scope.row.profit_rate | numberFormat3 }}%</span>
                    </strong>
                  </div>
                  <strong class="title">{{ scope.row.strg_market_nm }}</strong>
                  <div class="etc">
                    <span class="space"><!-- {{ $t("ranking.a009-1") }} 거래소 --> {{ scope.row.exid }}</span>
                    <span class="space"><!-- {{ $t("ranking.a009-3") }} 종목명 --> {{ scope.row.jong_cd }}</span>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

		<infinite-loading v-if="isInfinite" spinner="spiral" ref="infiniteLoading" @infinite="infiniteHandler">
			<div slot="no-more"></div>
			<div slot="no-results"></div>
		</infinite-loading>

	</div>
</template>

<script>
import { mapGetters } from "vuex";
import InfiniteLoading from 'vue-infinite-loading';
import TradingAvailStraDetail from "../auto/TradingAvailStraDetail";
import TradingRunningStraDetail from "../auto/TradingRunningStraDetail";
export default {
  components: {
     InfiniteLoading,
     TradingAvailStraDetail,
     TradingRunningStraDetail
  },
  computed: {
    ...mapGetters(['getUserInfo', 'isSocketConnected'])
  },
  watch : {
    getUserInfo: {
      handler: function(newVal, oldVal) {
        const self = this;
        if(self.getUserInfo)
          self.runningStraData = [];
          self.getRunningStra();
      }
    }
  },
  data() {
    return {
      isInfinite: false,

      signal_name: '', //시그널전략명

      //-모든전략리스트
      availStraData: [],
      loading: '',
      currentPage: 1,
      pageSize: 20,
      total: 0,

      //-운용전략리스트
      emptyText:"API Key 등록하고 자동매매를 시작하세요.",
      runningStraData: [],

      selectedRow: {}, //선택된 row
      runningStraVisible : true,

      from: '',
      signalSeq:''

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
        //default images
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
    goLink() {    
      const url = "http://www.youtube.com/watch?v=qvIz_BXbelY"
      window.open(url);
    },

    //유투브 사용법
    onIntroduceService() {
      const self = this;
      self.$router.push({ path: "/intro/service", query: { tab: 1, type: 'V' } });
    },

    headerStyle(row, rowIndex){
      return 'font-size:12px;'
    },

    //전략리스트 조회
    infiniteHandler($state) {
      const self = this;

      let header = { trName: 'at310' }
      let input = {
        InBlock1: [{
          strg_pack_seq: '',
          page_no:  self.currentPage,
          page_div_cnt: self.pageSize
        }]
      }

      console.log("at310_InBlock1:"+JSON.stringify(input));
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("infiniteHandler:", queryData);
        if (queryData != null) {
          if (queryData.queryObj) {

            let output = queryData.queryObj.OutBlock1[0];
            self.total = parseInt(queryData.queryObj.OutBlock1[0].out_cnt);

            if (output != null) {
              if (output.rslt_cls == '1') {
                if (output.out_cnt * 1 > 0) {
                    let tmpList = queryData.queryObj.OutBlock2;
                    if (tmpList.length > 0) {
                      self.availStraData = self.availStraData.concat(tmpList);
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
        } else {
          $state.complete();
        }
      });
    },
    //운용전략리스트 조회
    getRunningStra() {
      const self = this;

      let header = { trName: 'at316' }
      let input = {
        InBlock1: [{
          enc_user_id	: self.getUserInfo.user_id, //사용자ID

        }]
      }
      console.log("at316_input", JSON.stringify(input));
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("getRunningStra:", queryData);
        if (queryData != null) {
          if (queryData.queryObj) {
            let output = queryData.queryObj.OutBlock1[0];

            if (output != null) {
              if (output.rslt_cls == '1') {
                let tmpList = queryData.queryObj.OutBlock2;
                if (tmpList.length > 0) {

                  self.runningStraData = self.runningStraData.concat(tmpList);
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
    //등록 콜백
    registerCallback(queryData) {
      const self = this;
      if (queryData.queryObj) {
        let output = queryData.queryObj.OutBlock1[0];
        if (output != null) {
          if (output.rslt_cls == '1') {
            //등록성공시 관심메뉴로 이동          
            self.$router.push({ name: "HomeInterest", params: { straSeq: self.signalSeq } });
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
    // 관심전략저장
    saveInterStra(val) {

     const self = this;
      let header = { trName: 'at334' }
      let input = {
        InBlock1: [{
          gb	: '1',    //0:조회 1:등록 2:삭제
          enc_user_id: self.getUserInfo.user_id,  //사용자ID
          signal_seq: val.strg_pack_seq,     //패키지전략키

        }]
      }
      self.signalSeq = val.strg_pack_seq
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("saveInterStra", queryData);
        if (queryData != null) {
              self.registerCallback(queryData);
        }
      });
    },

    //가능한 전략 상세페이지 이동
    goDetailViewOnAvailStra(row) {
      const self = this;

      if(self.from == 'registerStra')
      {
        //관심전략 저장
        self.saveInterStra(row);
      } else {
        self.$router.push({
          name: "AutoTradingAvailStraDetail",
          query: { straSeq:row.strg_pack_seq}
        });
      }
    },
    //운용 전략 상세페이지 이동
    goDetailViewOnRunningStra(row) {
      const self = this;
      self.$router.push({
        name: "AutoTradingRunningStraDetail",
        query: { straSeq:row.strg_pack_seq}
      });

    },

    changeLangType() {
      const self = this;
      self.$EventBus.$emit("setLogo", { type: "", text: self.$t('ranking.a001') });
      self.getData();
    },

    getData() {
      const self = this;
      if (self.runningStraVisible) {
        self.getRunningStra();
      }

      if (self.isInfinite) {
        self.availStraData = [];
        self.currentPage = 1;
        self.$refs.infiniteLoading.stateChanger.reset();
      } else {
        self.isInfinite = true;
      }
    },
  },
   created() {
    const self = this;
    self.$EventBus.$on("changeLangType", self.changeLangType);
    self.$EventBus.$emit("setLogo", {
      type: "",
      text: "전략구매" //self.$t('expert.a001')
    });
    self.$EventBus.$emit("setMenuIndex", "2-1");
  },
  mounted(){
    const self = this;
    if (self.$route.query.inter) {
      self.from = self.$route.query.inter
      self.runningStraVisible = false;
    } else {
      self.runningStraVisible = true;
    }

    if (self.isSocketConnected) {
      self.getData();
    }
    self.$EventBus.$on('socketConnected', self.getData);
  },

  beforeDestroy() {
    const self = this;
    self.$EventBus.$off("changeLangType", self.changeLangType);
    self.$EventBus.$off('socketConnected', self.getData);
  }
}
</script>
