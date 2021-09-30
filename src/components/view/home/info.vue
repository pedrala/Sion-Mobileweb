<template>
  <div style="font-size:12px">
    <div style="height:25px;" >
      <span style="float:left;margin-left:10px">자료: coinmarketcap </span>
      <span style="float:right;margin-right:10px">{{ dateTime | dateFormat5 }}</span>
    </div>
    <el-table :data="coinInfoData"
      class="info-table"
      :default-sort="{ prop: 'market_cap', order: 'descending' }"
      @sort-change="sortChange"
      :empty-text="emptyText"
      ref="tableRef"
      :show-header="true"
      fit
      :header-row-style="headerStyle"
      lazy>
      <!--:cell-style="{padding: '0', height: '50px'}"-->
      <el-table-column prop="name" label="상품명" header-align="center" align="center">
        <template slot-scope="scope">
          <div class="pro-title">
            <div class="pro-title-ico">
              <img :src="getCoinImage(scope.row.symbol)">
            </div>
            <div class="pro-title-txt">
              <div><b>{{ scope.row.name }}</b></div>
              <span>{{ scope.row.symbol }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="market_cap" sortable="custom" width="100" header-align="center" align="right">
        <template slot="header" slot-scope="scope">
          <span>
            <el-popover placement="bottom-start" width="265" trigger="click">
              <p style="font-size:12px">시가총액:<br>블록체인 산업에서 시가총액 용어는 암호화폐의 상대적인 값을 의미하며 특정코인 또는 토큰의 현재 시장가격과 유통중인 총 코인수를 곱하여 계산<br><br>시가총액 = 현재가격 * 유통물량</p>
              <span slot="reference"><i class="el-icon-info"></i></span>
            </el-popover>
          </span>
          시가총액
        </template>
        <template slot-scope="scope">
          <div style="font-size:12px">₩{{ scope.row.market_cap | numberFormat4 }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="volume" sortable="custom" width="100" header-align="center" align="right">
        <template slot="header" slot-scope="scope">
          <span>
            <el-popover placement="bottom-start" width="265" trigger="click">
              <p style="font-size:12px">거래금액:<br>지난 24 시간 동안 거래 된 암호 화폐의 양을 측정합니다.</p>
              <span slot="reference"><i class="el-icon-info"></i></span>
            </el-popover>
          </span>
          거래금액
        </template>
        <template slot-scope="scope" >
          <div style="font-size:12px">₩{{ scope.row.volume | numberFormat4 }}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters([ 'isSocketConnected', 'getCoinImage' ])
  },
  data() {
    return {
      coinInfoData: [],
      emptyText: '코인정보가 없습니다.',
      currentPage: 1,
      pageSize: 100,
      total: 0,
      dateTime: '',
      sort_gb: '1', //1:시가총액 상위순 2:시가총액 하위순 3:거래대금 상위순 4: 거래대금 하위순
    };
  },
  methods: {
    headerStyle(row, rowIndex) {
      return 'font-size:12px;color:black'
    },
    sortChange(column) {
      console.log(column);
      const self = this;

      //Get the field name and sort type
      var fieldName = column.prop;
      var sortingType = column.order;

      //Sort in descending order
      if (sortingType == "descending") {
        self.coinInfoData = self.coinInfoData.sort((a, b) => parseInt(b[fieldName]) - parseInt(a[fieldName]));
      } else if (sortingType == "ascending") {
        //Sort in ascending order
        self.coinInfoData = self.coinInfoData.sort((a, b) => parseInt(a[fieldName]) - parseInt(b[fieldName]));
      } else if (sortingType == null) {
        //화살표 설정되어 있지 않을 경우, 기본 내림차순으로 설정
        self.coinInfoData = self.coinInfoData.sort((a, b) => parseInt(b[fieldName]) - parseInt(a[fieldName]));
      }
    },
    getCoinInfoData() {
      const self = this;
      let header = { trName: 'at337' }
      let input = {
        InBlock1: [{
          sort_gb	: self.sort_gb//1:시가총액 상위순 2:시가총액 하위순 3:거래량 상위순 4: 거래량 하위순
        }]
      }
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("getCoinInfoData", queryData);
        if (queryData != null) {
          if (queryData.queryObj) {

            let output = queryData.queryObj.OutBlock1[0];
            self.dateTime = output.datetime;
            self.total = parseInt(queryData.queryObj.OutBlock1[0].out_cnt);

            if (output != null) {
              if (output.rslt_cls == '1') {
                if (output.out_cnt * 1 > 0) {
                  let tmpList = queryData.queryObj.OutBlock2;
                  if (tmpList.length > 0) {
                    self.coinInfoData = self.coinInfoData.concat(tmpList);
                  }
                }
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
      self.getCoinInfoData();
    },
  },
  mounted(){
    const self = this;
    if (self.isSocketConnected) {
      self.getData();
    }
    self.$EventBus.$on('socketConnected', self.getData);
  },
  beforeDestroy() {
    const self = this;
    self.$EventBus.$off('socketConnected', self.getData);
  },
}
</script>
