<template>
  <li @click="moveDetailPage(item)" :key="item.coincd" class="product-list-body">
    <div v-if="coin" class="col">
      {{ item.vexid | exchangeName }}
    </div>
    <div :class="coin?'col':'col coin'">
      <div class="price-title">
        <div v-if="coin">
        </div>
        <div v-else  class="price-title-img">
          <img :src="getCoinImage(item.coincd)" />
        </div>
        <div class="price-title-info">
          {{ item.coincd }}
          <span>${{ item.cumdealqty | numberFormat4 }}</span>
        </div>
      </div>
    </div>
    <div class="col tx-rt">
      <div class="price-market">{{ item.closeprc | numberFormat2 }}<span>({{ item.moneycd }})</span>
      </div>
    </div>
    <div class="col tx-rt">
      <span class="comparison" :style="{ color: item.gb=='+'?'#f8696b':item.gb=='-'?'#409EFF':'' }">{{ item.updnrate }}%</span>
    </div>
  </li>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: [ "item", "coin", "from" ],
  computed: {
    ...mapGetters([ 'getCoinImage', 'getUserInfo' ])
  },
  data() {
    return {
      savedSymbol:''   
    };
  },
  methods: {

    //등록 콜백
    registerCallback(queryData) {
      const self = this;
      if (queryData.queryObj) {
        let output = queryData.queryObj.OutBlock1[0];
        if (output != null) {
          if (output.rslt_cls == '1') {
            //등록성공시 관심메뉴로 이동
            self.$router.push({ name: "HomeInterest", params: { symbol: self.savedSymbol } });
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
    // 관심코인저장
    saveInterCoin(val) {
     const self = this;
      let header = { trName: 'at333' }
      let input = {
        InBlock1: [{
          gb: '1',    //0:조회 1:등록 2:삭제
          enc_user_id: self.getUserInfo.user_id,  //암호화된 ID
          symbol: val.symbol,     //코인코드
          coin_cd: 	val.coincd,
        }]
      }
      self.savedSymbol = val.symbol    
      console.log("at333_input:" + JSON.stringify( input))
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("saveInterCoin:", queryData);
        if (queryData != null) {
          self.registerCallback(queryData);
        }
      });
    },
    openFullScreen(){
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        setTimeout(() => {
          loading.close();
        }, 1000);
    },
    moveDetailPage(row){
       const self = this;
       if (self.from == 'registerCoin') {
          //관심코인 저장
          self.saveInterCoin(row);
       } else {
        // self.openFullScreen()
        self.$router.push({
            path: '/sise/price',
            query: {
              symbol: row.symbol,
              coincd: row.coincd,
            }
          });
       }
    },
  },
}
</script>
