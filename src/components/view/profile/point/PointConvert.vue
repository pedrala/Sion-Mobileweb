<template>
	<div class="point-wrap">
    <div class="my-point">
      <span class="my-point-title">환전 가능 포인트</span>
      <span class="my-point-price">{{ refundInfo.chg_able_p | numberFormat  }} P</span>
    </div>

    <div class="point-convert">
      <div class="point-convert-l" style="width:55%;">
        <span class="title">환전 신청</span>
        <el-input v-model="refundPoint">
          <template slot="suffix">P</template>
        </el-input>
      </div>
      <div class="point-convert-r">
        <span class="title">입금 예상금액</span>
        <div class="input alignR disabled">
          {{ refundPrice | numberFormat }}  원
        </div>
      </div>
    </div>

    <div class="point-account">
      <div class="point-account-item">
        <label class="name">은행</label>
        <el-select v-model="bankCd" value-key="id" placeholder="선택"  size="small" style="width: 100%;line-height: 45px;float: right;margin-bottom:0px;">
          <el-option v-for="item in bankInfo" :key="item.bank_code" :label="item.bank_name" :value="item.bank_code"></el-option>
        </el-select>
      </div>
      <div class="point-account-item">
        <label class="name">계좌번호</label>
        <el-input v-model="accId" placeholder="계좌번호 입력 (-제외)" type="number" maxlength="14" size="small" style="font-size:12px"></el-input>
        <!-- <el-input v-model="depositAccNo1" type="number" :maxlength="6" size="mini">
        </el-input>
        <el-input v-model="depositAccNo2" type="number" :maxlength="6" size="mini">
        </el-input>
        <el-input v-model="depositAccNo3" type="number" :maxlength="6" size="mini">
        </el-input> -->
      </div>
      <!-- <span class="name">입금 계좌</span>
      <el-input v-model="bankInfo.bank_nm" class="input alignR" style="width: 140px;" disabled></el-input>
      <el-input :value="bankInfo.acct_no | accountFormat" class="input alignR" style="width: 180px; margin-left: 5px;" disabled></el-input>
      <el-input :value="bankInfo.user_nm | nameFormat" class="input alignR" style="width: 100px; margin-left: 5px;" disabled></el-input> -->
    </div>

		<div class="btns point-btns">
			<el-button @click="goConvert" type="primary" class="button block" :disabled="!chkPoint">
        환전 신청 하기
			</el-button>
		</div>

    <div class="auto-trade-wrap">
      <div class="auto-trade-list">
        <h3 class="auto-trade-title">
          환전 내역
        </h3>
        <el-table :data="convertHistoryData"  :empty-text="emptyText" border
            class="table"
            :header-row-style="headerStyle"
            :cell-style="{padding: '0px', height: '55px'}">
          <el-table-column label="환전신청일시">
            <template slot-scope="scope">
              <span style="word-break: keep-all;">
              {{ scope.row.req_dt | dateFormat2 }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="은행/계좌번호/환전신청금액" width="140">
            <template slot-scope="scope">
                {{ scope.row.bank_name | numberFormat }}
              <br />
                {{ scope.row.acct_id }}
              <br />
                {{ scope.row.exchg_point | numberFormat }}{{ $t('common.won') }}
            </template>
          </el-table-column>
          <el-table-column label="입금예상금액/환전수수료/상태" width="100">
            <template slot-scope="scope">
                {{ scope.row.deposit_money | numberFormat }}{{ $t('common.won') }}
              <br />
                {{ scope.row.exchg_fee | numberFormat }} {{ $t('common.won') }}<!-- 원 -->
              <br />
                <el-button v-if="scope.row.state=='0'" @click="cancelConvert(scope.row.req_dt)" class="button button-bg02 button-sizeS"><!-- 환전취소 -->
                  {{ stateFormat(scope.row.state) }}
                </el-button>
                <el-button v-else-if="scope.row.state=='2'" @click="rejectConfirm(scope.row.req_dt)" class="button button-bg02 button-sizeS"><!-- 반려 -->
                  {{ stateFormat(scope.row.state) }}
                </el-button>
                <span v-else>
                  {{ stateFormat(scope.row.state) }}
                </span>    <!-- 상태(0:처리진행중/1:환전완료/2:반려)	  -->
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
export default {
  computed: {
    ...mapGetters(['getUserInfo', 'isSocketConnected'])
  },

  components: {
     InfiniteLoading
  },
  data() {
    return {
      isInfinite: false,
      curPage: 1,
      pageCount: 10,
      totalCnt: 0,
      convertHistoryData: [],

      refundInfo: {},
      refundPoint: '',
      refundPrice: '',
      chkPoint: true,

      point: {},
      emptyText  : '환전내역이 없습니다.',
      bankInfo: [],  //은행목록
      bankCd:'',    
      memo: '',
      accId: '',
      // depositAccNo1:'',
      // depositAccNo2:'',
      // depositAccNo3:'',

    };
  },
  filters: {

  },
  watch: {
      //환전신청 버튼 활성/비활성화
			refundPoint(val, old) {
				const self = this;
				let refundPoint = Number(val);
				let fee = Number(self.refundInfo.chg_fee); //환전수수료
				if (self.refundInfo.chg_gb == '0') { //환전구분('0':가격 '1':%)
					self.refundPrice = refundPoint - fee < 0 ? 0 : refundPoint - fee;
				} else if (self.refundInfo.chg_gb == '1') {
					fee = refundPoint * fee / 100;
					self.refundPrice = refundPoint - fee < 0 ? 0 : refundPoint - fee;
				}
        //활성화 조건: 최소신청금액 < 환전신청포인트  &&  환전신청포인트 < 환전가능포인트
				if (Number(self.refundInfo.min_money) <= Number(self.refundPrice) && refundPoint <= Number(self.refundInfo.chg_able_p)) {
					self.chkPoint = true;  //환전신청 버튼 활성화
				} else {
					self.chkPoint = false;  //환전신청 버튼 비활성화
				}
			}
	},
  methods: {
    headerStyle(row, rowIndex){
      return 'font-size:12px;'
    },

    stateFormat(val) {
				const self = this;
				if (val) {
					if (val == '0') {
						return "["+'처리진행중'+"]"; // 처리진행중 self.$t('mypage.b102.a015-1')
					} else if (val == '1') {
						return self.$t('mypage.b102.a015-2'); // 환전완료
					} else if (val == '2') {
						return "["+self.$t('mypage.b102.a015-3')+"]"; // 반려
					} else {
						return val;
					}
				}
				return '';
			},

    //Apple Store 결제
    goPay(){
      	const self = this;

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
    convertApply(){
      const self = this;

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

    pointRecharge() {
      const self = this;
      self.getMyPoint();
    },
    convertCallback(queryData) {
      console.log("convertCallback:", queryData);
      const self = this;
      if (queryData.queryObj) {
        let output = queryData.queryObj.OutBlock1[0];
        if (output != null) {
          if (output.rslt_cls == '1') {
            self.resetInput();
            self.curPage = 1;
            self.isInfinite = true

            // 환전 신청이 완료되었습니다
            self.$alert(self.$t('mypage.b102.a018'), '', {
              confirmButtonText: self.$t("common.confirm")
            });
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
    goConvert() {
        const self = this;
        //필수입력확인
        if (self.refundPoint == '') {
          // 환전신청할 포인트를 입력해 주세요.
          self.$alert('환전신청할 포인트를 입력해 주세요.', '', {
            confirmButtonText: self.$t('common.confirm')
          });
          return;
        }

        if (self.bankNm == '') {
          // 은행을 선택해 주세요.
          self.$alert('은행을 선택해 주세요.', '', {
            confirmButtonText: self.$t('common.confirm')
          });
          return;
        }
        if (self.accId == '' ){
       // if (self.depositAccNo1 == '' || self.depositAccNo2 == ''|| self.depositAccNo3 == '') {
          // 계좌번호를 입력해 주세요.
          self.$alert('계좌번호를 입력해 주세요.', '', {
            confirmButtonText: self.$t('common.confirm')
          });
          return;
        }

				// 환전 신청을 진행하시겠습니까?
				self.$confirm(self.$t('mypage.b102.a019'), {
					confirmButtonText: self.$t("common.confirm"),
					cancelButtonText: self.$t("common.cancel"),
					center: true,
				}).then(() => {
					let header = {
						trName: 'at343'
					}
					let input = {
						InBlock1: [{
              enc_user_id     : self.getUserInfo.user_id, //고객ID
              ex_req_point		: self.refundPoint,  //환전신청포인트
              rcv_money	      : self.refundPrice, //입금예상금액
              req_bnk_cd			: self.bankCd,  //은행코드
              req_acct_no			:  self.accId,//self.depositAccNo1 +'-'+ self.depositAccNo2 +'-'+ self.depositAccNo3  //입금계좌번호

						}]
          }
          console.log("at343_intput:", JSON.stringify(input));
					self.$socket.sendProcessByName(header, input, function(queryData) {
						if (queryData != null) {
							self.convertCallback(queryData);
						}
					});
				}).catch(err => console.log(err));
    },
    cancelConvertCallback(queryData) {
      console.log("cancelConvertCallback:", queryData);
      const self = this;
      if (queryData.queryObj) {
        let output = queryData.queryObj.OutBlock1[0];
        if (output != null) {
          if (output.rslt_cls == '1') {

            self.resetInput();
            self.curPage = 1;
            self.isInfinite = true

            self.$alert("취소가 완료되었습니다.", '', {
              confirmButtonText: self.$t("common.confirm")
            });
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

    //환전 취소
    cancelConvert(val) {
        const self = this;

        // 환전 신청을 진행하시겠습니까?
				self.$confirm("처리진행중인 환전신청내역을<br> 취소하시겠습니까?", {
					confirmButtonText: self.$t("common.confirm"),
          cancelButtonText: self.$t("common.cancel"),
          dangerouslyUseHTMLString: true,
					center: true,
				}).then(() => {

          let header = {
            trName: 'at345'
          }
          let input = {
            InBlock1: [{
              enc_user_id: self.getUserInfo.user_id,
              reg_dt	: val  //신청일

            }]
          }
          console.log("at345_intput:", JSON.stringify(input));
					self.$socket.sendProcessByName(header, input, function(queryData) {
						if (queryData != null) {
							self.cancelConvertCallback(queryData);
						}
					});
        }).catch(err => console.log(err));

    },
    rejectConfirmCallback(queryData) {
      console.log("rejectConfirmCallback:", queryData);
      const self = this;
      if (queryData.queryObj) {
        let output = queryData.queryObj.OutBlock1[0];
        if (output != null) {
          if (output.rslt_cls == '1') {

            self.resetInput();
            self.curPage = 1;
            self.isInfinite = true

            self.$alert( output.memo , '', {
              confirmButtonText: self.$t("common.confirm")
            });
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
    //반려 확인
    rejectConfirm(val) {
				const self = this;
				let header = {
					trName: 'at346'
				}
				let input = {
					InBlock1: [{
            enc_user_id: self.getUserInfo.user_id,
						reg_dt	: val  //신청일
					}]
        }
        console.log("at346_intput:", JSON.stringify(input));
				self.$socket.sendProcessByName(header, input, function(queryData) {
					if (queryData != null) {
            	self.rejectConfirmCallback(queryData);
					}
				});

    },
    //은행 조회
    getBankList() {
				const self = this;
				let header = {
					trName: 'at342'
				}
				let input = {
					InBlock1: [{

					}]
				}
				self.$socket.sendProcessByName(header, input, function(queryData) {
            console.log("at342_output:", queryData);
					if (queryData != null) {
            	let output = queryData.queryObj.OutBlock1[0];
              if (output != null) {
                if (output.rslt_cls == '1') {
                  self.bankInfo = queryData.queryObj.OutBlock2;

                } else {
                  let rslt_msg = output.rslt_msg;
                  console.log(rslt_msg);
                }
              }
					}
				});

    },

    //환전리스트 조회
    infiniteHandler($state){

				const self = this;
				let header = {
					trName: 'at344'
				}
				let input = {
					InBlock1: [{
						enc_user_id: self.getUserInfo.user_id,
						page_no: self.curPage,
						page_div_cnt: self.pageCount
					}]
        }
        console.log("at344_intput:", input);
				self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("at344_output:", queryData);
        if (queryData != null) {
          if (queryData.queryObj) {

            let output = queryData.queryObj.OutBlock1[0];
            self.totalCnt = parseInt(queryData.queryObj.OutBlock1[0].out_cnt);

            if (output != null) {
              if (output.rslt_cls == '1') {
                if (output.out_cnt * 1 > 0) {
                    let tmpList = queryData.queryObj.OutBlock2;
                    if (tmpList.length > 0) {
                      self.convertHistoryData = self.convertHistoryData.concat(tmpList);
                    }
                    self.curPage += 1;
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
    refundInfoCallback(queryData) {
        console.log("at074_output:", queryData);
        const self = this;
				if (queryData.queryObj) {
					let output = queryData.queryObj.OutBlock1[0];
					if (output != null) {
						if (output.rslt_cls == '1') {
              self.refundInfo = output;
						} else {
              let rslt_msg = output.rslt_msg;
              console.log(rslt_msg);
						}
					}
				} else {
          self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
            confirmButtonText: self.$t("common.confirm"),
          });
				}
    },
    //환전가능포인트 조회
    getRefundInfo() {
				const self = this;
				let header = {
					trName: 'at074'
				}
				let input = {
					InBlock1: [{
						enc_user_id: self.getUserInfo.user_id,
					}]
        }
        console.log("at074_input:", input);
				self.$socket.sendProcessByName(header, input, function(queryData) {
					if (queryData != null) {
						self.refundInfoCallback(queryData);
					}
				});
      },


    getData() {
      const self = this;
      self.resetInput();        
      //은행조회
      self.getBankList();
      //환전내역조회
      if (self.isInfinite) {
        self.convertHistoryData = [];
        self.curPage = 1;
        self.$refs.infiniteLoading.stateChanger.reset();
      } else {
        self.isInfinite = true;
      }
    },

    resetInput() {
      const self = this;
      //환전가능포인트 조회
      self.getRefundInfo();
      self.refundPoint = '';
      self.bankCd = '';
      self.accId = '';
    },

  },

  mounted() {
    const self = this;
    if (self.isSocketConnected) {
      self.getData();

    } else {
      self.$EventBus.$on('socketConnected', self.getData);
    }
  },
  created() {
    const self = this;
    self.$EventBus.$on('pointConvert', self.getData);
  },
  beforeDestroy() {
    const self = this;
    self.$EventBus.$off('pointConvert', self.getData);
    self.$EventBus.$off('socketConnected', self.getData);
  }
}
</script>
