<template>
  <div class="point-wrap">
    <table class="point-table">
      <thead>
        <tr>
          <th>포인트</th>
          <th>원화</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>9,900 P</td>
          <td>
            <el-link @click="goPay(purchase_item1)" class="member">9,900 KRW</el-link>
          </td>
        </tr>
        <tr>
          <td>19,900 P</td>
          <td>
            <el-link @click="goPay(purchase_item2)" class="member">19,900 KRW</el-link>
          </td>
        </tr>
        <tr>
          <td>29,900 P</td>
          <td>
            <el-link @click="goPay(purchase_item3)" class="member">29,900 KRW</el-link>
          </td>
        </tr>
        <tr>
          <td>59,900 P</td>
          <td>
            <el-link @click="goPay(purchase_item4)" class="member">59,900 KRW</el-link>
          </td>
        </tr>
        <tr>
          <td>119,900 P</td>
          <td>
            <el-link @click="goPay(purchase_item5)" class="member">119,900 KRW</el-link>
          </td>
        </tr>
        <tr>
          <td>199,900 P</td>
          <td>
            <el-link @click="goPay(purchase_item6)" class="member">199,900 KRW</el-link>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="point-msg">
        <p v-if="deviceType=='1'">
           포인트 구매 시 GOOGLE ID로 비용이 청구됩니다.
        </p>
        <p v-if="deviceType=='2'">
           포인트 구매 시 APPLE ID로 비용이 청구됩니다.
        </p>
    </div>
    <div class="agreement-ul">
      <ul>
        <li>
          <a @click="showTermsCondition('1')" class="member el-link">이용약관</a>   
        </li>
        <li>           
           <a @click="showTermsCondition('2')" class="member el-link">개인정보처리방침</a>         
        </li>
        <li>
           <a @click="showTermsCondition('7')" class="member el-link">환불규정</a>                   
        </li>
        <li>
           <a @click="showTermsCondition('8')" class="member el-link">포인트이용세부기준</a>    
        </li>
      </ul>
    </div>
    <div class="my-point">
      <span class="my-point-title">나의 보유 포인트</span>
      <span class="my-point-price">
        {{ point.own_point | numberFormat  }} P
      </span>
    </div>
	</div>
</template>
<script>

import { mapGetters } from "vuex";
import Terms from "../../common/Terms";
import moment from 'moment'

export default {
  computed: {
    ...mapGetters(['getUserInfo', 'isSocketConnected'])
  },
  components: {
    Terms,
  },
  data() {
    return {

      trdDt:'',  //거래일자
      trdTm:'',  //거래시각
      trdAmt:'', //거래금액
      techGb:'1', //1: Google 2:Apple

      purchase_item1: '',
      purchase_item2: '',
      purchase_item3: '',
      purchase_item4: '',
      purchase_item5: '',
      purchase_item6: '',
      point: {},
      deviceType:'' //'1':android, '2':'ios'

    };
  },
  filters: {

  },
  methods: {
    //약관 처리
    showTermsCondition(termType) {
      let self = this;
      self.$EventBus.$emit("openTerm", termType);

      if (termType == 1) {
        // self.agreeVisibles[0].checked = true
        self.checkedItems[0].checked = true;
        // return "이용약관";
      } else if (termType == 2) {
        // self.agreeVisibles[3].checked = true
        self.checkedItems[3].checked = true;
        // return "개인정보처리방침";
      } else if (termType == 3) {
        // self.agreeVisibles[1].checked = true
        self.checkedItems[1].checked = true;
        // return "해외시세제공약관";
      } else if (termType == 4) {
        // self.agreeVisibles[2].checked = true
        self.checkedItems[2].checked = true;
        // return "법적고지";
      } else if (termType == 5) {
        self.checkedItems[4].checked = true;
        // return "유료서비스 이용약관";
      } else if (termType == 6) {
        self.checkedItems[5].checked = true;
        // return "결제정보 제공동의";
      } else {
        // return "";
      }
    },
    //Apple Store 결제
    goPay(id){
      // alert("store.order:"+id);
      const self = this;
      store.order(id);
      // store.refresh();
      // store.when(id).updated(self.render(id));
      // store.when(id).approved(function (order) {
      //   alert("order finish:"+id);
      //   order.finish();
      //   store.refresh();
      // });
    },
    //충전
    getRecharge(){
        const self = this;
      	let header = {
					trName: 'at341'
				}
				let input = {
					InBlock1: [{
            enc_user_id: self.getUserInfo.user_id,
            trd_dt: self.trdDt,  //거래일자
            trd_tm: self.trdTm,  //거래시각
            trd_amt: self.trdAmt,  //거래금액
            tech_gb: self.techGb,   //1: Google 2:Apple
					}]
				}
				self.$socket.sendProcessByName(header, input, function(queryData) {
					console.log("getRecharge", queryData);
					if (queryData != null) {
              if (queryData.queryObj)
              {
                let output = queryData.queryObj.OutBlock1[0];

                if (output != null) {
                  if (output.rslt_cls == '1') {
                     self.getMyPoint();
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

    reset() {
      const self = this;
      self.trdDt = '',
      self.trdTm = '',
      self.trdAmt = '',
      self.point = {};
    },

    pointRecharge() {
      const self = this;
      self.reset();
      self.getMyPoint();
    },

    render(prod_id) {
      // Get the product from the pool.
      var product = store.get(prod_id);
      // alert("store.render product:"+product);
      if (!product) {
        // alert("store.render product: nothing");
          console.log("store product: nothing");
      }
      else if (product.state === store.REGISTERED) {
         console.log("store state: loading");
        //  alert("store.render state:loading");
      }
      else if (product.state === store.INVALID) {
          console.log("store state: ");
          alert("store.render store.INVALID:"+store.INVALID);
      }
      else {
        // Good! Product loaded and valid.
        console.log("store : "+product.title+"="+product.description+"="+product.price);
        alert("store.render store:"+product.title+"="+product.description+"="+product.price);

        // Is this product owned? Give him a special class.
        // alert("store.render owned:"+product.owned);
        if (product.owned) {
          console.log("store owned:"+product.owned);
        } else {
          console.log("store owned:"+product.owned);
        }

        // Is an order for this product in progress? Can't be ordered right now?
        alert("store.render canPurchase:"+product.canPurchase);
        if (product.canPurchase)
            console.log("store canPurchase:"+product.canPurchase);
        else
            console.log("store canPurchase:"+product.canPurchase);
        }
    },
    getPoint(p) {
      var point = '';
      if(p.id == 'point_01')
        point = '9900';
      else if(p.id == 'point_02')
        point = '19900';
      else if(p.id == 'point_03')
        point = '29900';
      else if(p.id == 'point_04')
        point = '59900';
      else if(p.id == 'point_05')
        point = '119900';
      else if(p.id == 'point_06')
        point = '199900';

      return point;
    },
    setPoint(p) {
      const self = this;
      self.trdDt =  moment().format('YYYYMMDD'); //거래일자(8)
      self.trdTm =  moment().format('hhmmss');  //거래시각(6)
      self.trdAmt = self.getPoint(p); //거래금액
      //1: Google 2:Apple
      if(afc.isAndroid)
        self.techGb = '1';
      else if(afc.isIos)
        self.techGb = '2';

      // alert("구매가 완료되었습니다."+self.trdDt+"="+self.trdTm+"="+p.id);
      var rslt_msg = "구매가 완료되었습니다.";
      if(self.getPoint(p)!='')
        self.getRecharge();
      else
        rslt_msg = "구매가 완료되었으나 포인트 충전이 실패하였습니다.";
        // alert("구매가 완료되었으나 포인트 입금이 실패하였습니다.");

      self.$alert(rslt_msg, '', {
        confirmButtonText: self.$t("common.confirm")
      });
    },
    finishPurchase1(p) {
      const self = this;
      p.finish();
      self.setPoint(p); //포인트 충전
    },
    finishPurchase2(p) {
      const self = this;
      p.finish();
      self.setPoint(p); //포인트 충전
    },
    finishPurchase3(p) {
      const self = this;
      p.finish();
      self.setPoint(p); //포인트 충전
    },
    finishPurchase4(p) {
      const self = this;
      p.finish();
      self.setPoint(p); //포인트 충전
    },
    finishPurchase5(p) {
      const self = this;
      p.finish();
      self.setPoint(p); //포인트 충전
    },
    finishPurchase6(p) {
      const self = this;
      p.finish();
      self.setPoint(p); //포인트 충전
    }
  },
  beforeMount() {
    const self = this;
    // store.when.unregister(self.finishPurchase);
    // store.off(self.finishPurchase1);
    // store.off(self.finishPurchase2);
    // store.off(self.finishPurchase3);
    // store.off(self.finishPurchase4);
    // store.off(self.finishPurchase5);
    // store.off(self.finishPurchase6);
    store.off(self.finishPurchase1);
    // self.$message("beforeMount");

  },
  mounted() {
    const self = this;
    if (self.isSocketConnected) {
      self.pointRecharge();
    } else {
      self.$EventBus.$on('socketConnected', self.pointRecharge);
    }

	store.off(self.finishPurchase1);
    store.off(self.finishPurchase2);
    store.off(self.finishPurchase3);
    store.off(self.finishPurchase4);
    store.off(self.finishPurchase5);
    store.off(self.finishPurchase6);

    //인앱 구매 설정
    store.register({
      id: "point_01",
      alias: "point_01",
      type: store.CONSUMABLE
    });
    store.register({
      id: "point_02",
      alias: "point_02",
      type: store.CONSUMABLE
    });
    store.register({
      id: "point_03",
      alias: "point_03",
      type: store.CONSUMABLE
    });
    store.register({
      id: "point_04",
      alias: "point_04",
      type: store.CONSUMABLE
    });
    store.register({
      id: "point_05",
      alias: "point_05",
      type: store.CONSUMABLE
    });
    store.register({
      id: "point_06",
      alias: "point_06",
      type: store.CONSUMABLE
    });

    store.error(function(error) {
      console.log('ERROR ' + error.code + ': ' + error.message);
    });

    var p = store.get("point_01");
    self.purchase_item1 = p.id;
    console.log("store point_01:"+p.id);

    var p2 = store.get("point_02");
    self.purchase_item2 = p2.id;
    console.log("store point_02:"+p2.id);

    var p3 = store.get("point_03");
    self.purchase_item3 = p3.id;
    console.log("store point_03:"+p3.id);

    var p4 = store.get("point_04");
    self.purchase_item4 = p4.id;
    console.log("store point_04:"+p4.id);

    var p5 = store.get("point_05");
    self.purchase_item5 = p5.id;
    console.log("store point_05:"+p5.id);

    var p6 = store.get("point_06");
    self.purchase_item6 = p6.id;
    console.log("store point_06:"+p6.id);

    // self.render("com.kfits.sionapp.point_01");
    // self.render("com.kfits.sionapp.point_02");
    // self.render("com.kfits.sionapp.point_03");
    // self.render("com.kfits.sionapp.point_04");
    // self.render("com.kfits.sionapp.point_05");
    // self.render("com.kfits.sionapp.point_06");

    store.when(self.purchase_item1).updated(self.render(self.purchase_item1));
    store.when(self.purchase_item1).approved(function(p) {
      p.verify();
    });
    store.when(self.purchase_item1).verified(self.finishPurchase1);

    store.when(self.purchase_item2).updated(self.render(self.purchase_item2));
    store.when(self.purchase_item2).approved(function(p) {
      p.verify();
    });
    store.when(self.purchase_item2).verified(self.finishPurchase2);

    store.when(self.purchase_item3).updated(self.render(self.purchase_item3));
    store.when(self.purchase_item3).approved(function(p) {
      p.verify();
    });
    store.when(self.purchase_item3).verified(self.finishPurchase3);

    store.when(self.purchase_item4).updated(self.render(self.purchase_item4));
    store.when(self.purchase_item4).approved(function(p) {
      p.verify();
    });
    store.when(self.purchase_item4).verified(self.finishPurchase4);

    store.when(self.purchase_item5).updated(self.render(self.purchase_item5));
    store.when(self.purchase_item5).approved(function(p) {
      p.verify();
    });
    store.when(self.purchase_item5).verified(self.finishPurchase5);

    store.when(self.purchase_item6).updated(self.render(self.purchase_item6));
    store.when(self.purchase_item6).approved(function(p) {
      p.verify();
    });
    store.when(self.purchase_item6).verified(self.finishPurchase6);


    // store.when("com.kfits.sionapp.point_02").updated(self.render("com.kfits.sionapp.point_02"));
    // store.when("com.kfits.sionapp.point_03").updated(self.render("com.kfits.sionapp.point_03"));
    // store.when("com.kfits.sionapp.point_04").updated(self.render("com.kfits.sionapp.point_04"));
    // store.when("com.kfits.sionapp.point_05").updated(self.render("com.kfits.sionapp.point_05"));
    // store.when("com.kfits.sionapp.point_06").updated(self.render("com.kfits.sionapp.point_06"));

    // store.when("com.kfits.sionapp.point_01").approved(function (order) {
    //   alert("order finish");
    //   order.finish();
    //   store.refresh();
    // });

    store.refresh();
  },
  created() {
     const self = this;
    self.$EventBus.$on('pointRecharge', self.pointRecharge);
    if(afc.isAndroid)
      self.deviceType = '1';
    else if(afc.isIos)
      self.deviceType = '2';

  },
  beforeDestroy() {
    const self = this;
    self.$EventBus.$off('socketConnected', self.pointRecharge);
    self.$EventBus.$off('pointRecharge', self.pointRecharge);
    store.off(self.render);
    // store.off(self.finishPurchase1);
    // store.off(self.finishPurchase2);
    // store.off(self.finishPurchase3);
    // store.off(self.finishPurchase4);
    // store.off(self.finishPurchase5);
    // store.off(self.finishPurchase6);

    // self.$message("beforeDestroy");

    // store.when.unregister(self.finishPurchase1);
    // store.when.unregister(self.finishPurchase2);
    // store.when.unregister(self.finishPurchase3);
    // store.when.unregister(self.finishPurchase4);
    // store.when.unregister(self.finishPurchase5);
    // store.when.unregister(self.finishPurchase6);
    store.off(self.finishPurchase1);
  }
}
</script>
