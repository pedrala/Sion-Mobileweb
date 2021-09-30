<template>
  <div>

  <div class="auto-trade-wrap" style="margin:0;">
   <div class="auto-trade-list">
     <h3 class="auto-trade-title">
          수수료
     </h3>

    <el-table :data="pointFeeData" :empty-text="emptyText" ref="tableRef" :show-header="true"  border
       :header-row-style="headerStyle"
       :cell-style="{padding: '0px', height: '55px', }"
       style="width:100%;margin-top: 0px;margin-bottom: 60px;font-size:10px">
        <el-table-column label="거래소/전략명/사용" width="120" header-align="center" align="center">
           <template   slot-scope="scope">
               <div class="etc" >
              {{ scope.row.exid_nm }}<br> {{ scope.row.signal_nm }}<br> {{ scope.row.fee| numberFormat2 }} P
              </div>
          </template>
        </el-table-column>
         <el-table-column label="종목/일시" width="120" header-align="center"  align="center">
          <template  slot-scope="scope" >
              <div >
                {{ scope.row.jong_nm }}
                <p style="display: inline-block;word-break: keep-all;">{{ scope.row.datetime  | dateFormat2 }}</p>
              </div>
          </template>
        </el-table-column>
<!--   width="100"    -->
        <el-table-column label="구분/수량/가격" header-align="center"  align="center">
          <template slot-scope="scope">
              <div  class="etc">
                <span :class="(scope.row.side)=='1'||(scope.row.side)=='4' ? 'num color02' : 'num color03'">{{ scope.row.side | gbFormat}}</span>
                <br>
                <span >{{ scope.row.che_qty | numberFormat2}}</span>
                <br>
                <span >{{ scope.row.price | numberFormat2}}</span>
              </div>
          </template>
        </el-table-column>
    </el-table>
    </div>
  </div>
    <div class="my-point">
      <span class="my-point-title">보유 포인트</span>
      <span class="my-point-price">{{ point.own_point | numberFormat  }} P</span>
    </div>

	</div>
</template>
<script>

import { mapGetters } from "vuex";
export default {
   components: {

   },
  computed: {
    ...mapGetters(['getUserInfo', 'isSocketConnected'])
  },
  data() {
    return {
       emptyText: "수수료내역 없음",

       curPage:1,
       pageCount: 10,
       totalCnt: 0,

       pointFeeData: [] ,
       point: {}
    };
  },
  filters: {
    gbFormat(val){
        if(val == '1' || val == '4' )
          return '매수';
        else
          return '매도';
      }
  },
  methods: {

    headerStyle(row, rowIndex){
      return 'font-size:10px;color:black'
    },
    pointCallback(queryData) {
				const self = this;
				if (queryData.queryObj) {
					self.point = queryData.queryObj.OutBlock1[0];
				} else {
					self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
            confirmButtonText: self.$t("common.confirm"),
          });
				}
    },
    getMyPoint() {
				const self = this;
				let header = {
					trName: 'at080'
				}
				let input = {
					InBlock1: [{
						enc_user_id: self.getUserInfo.user_id
					}]
				}
				self.$socket.sendProcessByName(header, input, function(queryData) {
					console.log("getMyPoint", queryData);
					if (queryData != null) {
						self.pointCallback(queryData);
					}
				});
		},
    getPointFee()
    {
				const self = this;
				let header = {
					trName: 'at347'
				}

				let input = {
					InBlock1: [{
            enc_user_id: self.getUserInfo.user_id,
            page_no		:  self.curPage,
            page_div_cnt	: self.pageCount
					}]
				}
			  console.log("InBlock1_at347:"+JSON.stringify(input));
        self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("OutBlock_at347:", queryData);
					if (queryData != null) {
						if (queryData.queryObj) {
              let output = queryData.queryObj.OutBlock1[0];

							if (output != null) {
								if (output.rslt_cls == '1') {
                  if (output.out_cnt * 1 > 0) {
                    self.pointFeeData = self.pointFeeData.concat(queryData.queryObj.OutBlock2);
                    self.curPage += 1;

									} else {

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
					} else {

					}
				});
    },

    reset() {
      const self = this;
      self.curPage = 1,
      self.totalCnt = 0,
      self.pointEtcData = [];
      self.point = {};
    },

    pointFee() {
      const self = this;
      self.reset()
      self.getMyPoint();
      self.getPointFee();
    },

  },

  mounted() {
    const self = this;
    if (self.isSocketConnected) {
      self.pointFee();
    } else {
      self.$EventBus.$on('socketConnected', self.pointFee);
    }
  },
  created() {
    const self = this;
    self.$EventBus.$on('pointFee', self.pointFee);

  },
  beforeDestroy() {
    const self = this;
    self.$EventBus.$off('pointFee', self.pointFee);
    self.$EventBus.$off('socketConnected', self.pointFee);

  }
}
</script>
