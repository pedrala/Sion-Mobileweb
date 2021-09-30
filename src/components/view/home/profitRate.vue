<template>
    <div class="auto-trade-wrap">
      <h3 class="auto-trade-title">
        자동매매 전략
        <span>최근 30일 수익률</span>
      </h3>
      <div class="auto-trade-list">
       <el-table :data="profitRateData" ref="tableRef" :show-header="false" :empty-text="emptyText" class="table"
      :cell-style="{padding: '0px', height: '55px'}"
       style="margin-top: 0px;margin-bottom: 60px;">
          <el-table-column label="로고" width="80">
            <template slot-scope="scope">
              <div class="pro-icon-img" v-bind:style="{ backgroundImage: 'url(' + expertImage(scope.row.strg_pack_seq,scope.row.logo_key) + ')'}">
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="signal_name" @click="goDetailViewOnAvailStra(scope.row)" header-align="right">
            <template slot-scope="scope">
              <div @click="goDetailViewOnAvailStra(scope.row)">
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
    <infinite-loading v-if="isInfinite" spinner="spiral" ref="infiniteLoading" @infinite="infiniteHandler">
			<div slot="no-more"></div>
			<div slot="no-results"></div>
		</infinite-loading>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import InfiniteLoading from 'vue-infinite-loading'
export default {
  components: {
     InfiniteLoading,
  },
  data() {
    return {
      isInfinite: false,
      //수익률내역리스트
      profitRateData: [],
      emptyText:'수익률내역이 없습니다.',
      currentPage: 1,
      pageSize: 20,
      total: 0

    };
  },
  computed: {
    ...mapGetters([ "getUserInfo", "isSocketConnected" ])
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
    //가능한 전략 상세페이지 이동
    goDetailViewOnAvailStra(row) {
      const self = this;
      self.selectedRow = row;
      self.$router.push({
        name: "AutoTradingAvailStraDetail",
        query: { straSeq: row.strg_pack_seq }
      });
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

    //전략수익률리스트
    infiniteHandler($state) {
       const self = this;
      console.log("infiniteHandler start");

      let header = { trName: 'at310' }
      let input = {
        InBlock1: [{
            strg_pack_seq	: '',
            page_no		:  self.currentPage,
            page_div_cnt	: self.pageSize
        }]
      }

      console.log("at310_input:"+JSON.stringify(input));
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
                        self.profitRateData = self.profitRateData.concat(tmpList);
                       // self.colorProfitRate();

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
    getData() {
      const self = this;
      if (self.isInfinite) {
          self.profitRateData = [];
          self.currentPage = 1;
          self.$refs.infiniteLoading.stateChanger.reset();
        } else {
          self.isInfinite = true;
        }
    },
  },
  created() {
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
