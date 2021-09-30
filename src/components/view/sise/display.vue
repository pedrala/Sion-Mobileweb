<template>
  <div class="product-header">
    <div class="product-header-info">
      <div class="product-header-info-price">
        <span :style="{ color: data.gb=='+'?'#f8696b':data.gb=='-'?'#409EFF':'' }">{{ data.curPrice | numberFormat2 }}</span>
        <span class="unit">{{ getSymbol(data.symbol).currency }}</span>
      </div>
      <div class="product-header-info-compare">
        <span>전일대비</span>
        <span :style="{ color: data.gb=='+'?'#f8696b':data.gb=='-'?'#409EFF':'' }">{{ data.updnrate }}%</span>
        <span v-if="data.gb=='+'" style="color: #f8696b">
          <i class="el-icon-caret-top"></i>
          {{ data.diff | numberFormat2 }}
        </span>
        <span v-else-if="data.gb=='-'" style="color: #409EFF">
          <i class="el-icon-caret-bottom"></i>
          {{ data.diff | numberFormat2 }}
        </span>
        <span v-else>
          {{ data.diff | numberFormat2 }}
        </span>
      </div>
    </div>
    <div class="product-header-hl">
      <div class="low"><span>저</span> {{ data.curlowprc | numberFormat2 }}</div>
      <div>{{ data.curPrice | numberFormat2 }}</div>
      <div class="high"><span>고</span> {{ data.curhighprc | numberFormat2 }}</div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters([ 'isMaster', 'getSymbol' ])
  },
  props: [ 'symbol' ],
  data() {
    return {
      data: {}
    };
  },
  methods: {
    callbackTCS1(queryData) {
      // console.log(queryData.header.trName, queryData.queryObj.OutBlock1[0].kshcode);

      const self = this;
      let ob1 = queryData.queryObj.OutBlock1[0];
      self.data.curPrice = ob1.price;
      self.data.curlowprc = ob1.low;
      self.data.curhighprc = ob1.high;
      if ('45'.indexOf(ob1.change[0]) >= 0) {
        self.data.gb = '-';
      } else if ('12'.indexOf(ob1.change[0]) >= 0) {
        self.data.gb = '+';
      } else {
        self.data.gb = '';
      }
      self.data.diff = ob1.change.substr(1);
      self.data.updnrate = ob1.drate;
    },
    getData() {
      const self = this;
      let header = { trName: 'm1323' };
      let input = {
        InBlock1: [{
          symbol: self.symbol,
          cycunit: '',
          qrycnt: '1',
          cyc: '2', //분(1), 일(2), 주(3), 월(4), 틱(5)
          availflag: '',
          sdate: '',
          edate: '',
          datetype: '0', //한국시간 기준(0), GMT시간 기준(1)
          bojomsg: '', //최초 조회시 space, 연속조회시 이전 OutBlock1의 보조메세지
        }]
      }
      self.$socket.sendProcessByName(header, input, function(queryData) {
        if (queryData) {
          if (queryData.queryObj) {
            if (queryData.queryObj.OutBlock1 && queryData.queryObj.OutBlock1.length > 0) {
              self.data = queryData.queryObj.OutBlock1[0];
              let ob2 = queryData.queryObj.OutBlock2[0];
              self.data.curPrice = ob2.closeprc;
              self.data.gb = self.data.diff>0?'+':self.data.diff<0?'-':'';

              //registerReal
              self.$socket.registerReal("TCS1", '.Feed', [ self.symbol ], "display", self.callbackTCS1);
            } else {
              console.error("m1323 OutBlock1 is null");
            }
          } else {
            console.error(queryData.header);
          }
        } else {
          console.error("m1323 is null");
        }
      });
    },
  },
  created() {
  },
  mounted() {
    const self = this;
    if (self.isMaster) {
      self.getData();
    }
    self.$EventBus.$on("loadMaster", self.getData);
  },
  beforeDestroy() {
    const self = this;
    self.$EventBus.$off("loadMaster", self.getData);
    self.$socket.unregisterReal("TCS1", '.Feed', [ self.symbol ], "display");
  }
}
</script>
