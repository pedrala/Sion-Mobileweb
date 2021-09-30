<template>
  <div>

    <div class="auto-trade-wrap" style="margin:0;">
      <div class="auto-trade-list">
        <h3 class="auto-trade-title">
          기타
        </h3>

      <el-table :data="pointEtcData" :empty-text="emptyText" ref="tableRef" :show-header="true"  border
         :header-row-style="headerStyle"
         :cell-style="{padding: '0px', height: '55px'}"
         style="width:100%;margin-top: 0px;margin-bottom: 60px;font-size:10px">

           <el-table-column label="일시" width="90" header-align="center" align="center">
            <template  slot-scope="scope" >
               <div>
               <p style="display: inline-block;word-break: keep-all;">{{ scope.row.datetime  | dateFormat2 }}</p>
               </div>
            </template>
          </el-table-column>
          <el-table-column label="내역" header-align="center" align="center">
            <template slot-scope="scope">
                <div  class="etc">
                	<span >{{ scope.row.memo}}</span>
                </div>
            </template>
          </el-table-column>
          <el-table-column label="변동포인트" width="80" header-align="center" align="center">
             <template   slot-scope="scope">
                 <div class="etc" >
                 {{ scope.row.point| numberFormat2 }}
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

       emptyText: "포인트변동내역 없음",

       curPage:1,
       pageCount: 10,
       totalCnt: 0,

       pointEtcData: [],
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
    getPointEtc()
    {
				const self = this;
				let header = {
					trName: 'at348'
				}

				let input = {
					InBlock1: [{
            enc_user_id: self.getUserInfo.user_id,
            page_no		:  self.curPage,
            page_div_cnt	: self.pageCount
					}]
				}
			  console.log("InBlock1_at348:"+JSON.stringify(input));
        self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("OutBlock_at348:", queryData);
					if (queryData != null) {
						if (queryData.queryObj) {
              let output = queryData.queryObj.OutBlock1[0];

							if (output != null) {
								if (output.rslt_cls == '1') {
                  if (output.out_cnt * 1 > 0) {
                    self.pointEtcData = self.pointEtcData.concat(queryData.queryObj.OutBlock2);
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

    pointEtc() {
      const self = this;
      self.reset()
      self.getMyPoint();
      self.getPointEtc();
    },

  },

  mounted() {
    const self = this;
    if (self.isSocketConnected) {
      self.pointEtc();
    } else {
      self.$EventBus.$on('socketConnected', self.pointEtc);
    }
  },
  created() {
     const self = this;
     self.$EventBus.$on('pointEtc', self.pointEtc);

  },
  beforeDestroy() {
    const self = this;
    self.$EventBus.$off('pointEtc', self.pointEtc);
    self.$EventBus.$off('socketConnected', self.pointEtc);

  }
}
</script>
