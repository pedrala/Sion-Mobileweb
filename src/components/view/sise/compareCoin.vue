<template>
  <ul class="current_coin">
    <li>
      <span>{{ getSymbol(symbol1).coincd }} ({{ getSymbol(symbol1).vexidnm }})</span>
      <span>{{ data1.closeprc | numberFormat2 }} {{ data1.moneycd }}</span>
      <span :class="data1.diff>0?'color02':data1.diff<0?'color03':''">{{ data1.updnrate }}%</span>
    </li>
    <li>
      <span>{{ getSymbol(symbol2).coincd }} ({{ getSymbol(symbol2).vexidnm }})</span>
      <span>{{ data2.closeprc | numberFormat2 }} {{ data2.moneycd }}</span>
      <span :class="data2.diff>0?'color02':data2.diff<0?'color03':''">{{ data2.updnrate }}%</span>
    </li>
  </ul>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: [ 'symbol1', 'symbol2'],
  data() {
    return {
      beforeSymbol1: '',
      beforeSymbol2: '',

      data1: {},
      data2: {}
    };
  },
  watch: {
    symbol1() {
      const self = this;
      //리얼데이터 해지 (symbol1)
      if (self.beforeSymbol1 != '') {
        self.$socket.unregisterReal("TCS1", '.Feed', [ self.beforeSymbol1 ], "compareCoin1");
        self.beforeSymbol1 = '';
      }
      self.getData1();
    },
    symbol2() {
      const self = this;
      //리얼데이터 해지 (symbol1)
      if (self.beforeSymbol2 != '') {
        self.$socket.unregisterReal("TCS1", '.Feed', [ self.beforeSymbol2 ], "compareCoin2");
        self.beforeSymbol2 = '';
      }
      self.getData2();
    }
  },
  computed: {
    ...mapGetters([ 'isMaster', 'getSymbol' ]),
  },
  methods: {
    callbackTCS11(queryData) {
      const self = this;
      let block = queryData.queryObj.OutBlock1[0];
      if (block.kshcode == self.beforeSymbol1) {
        self.data1.closeprc = block.price;
        let gb = block.change[0];
        if ('12'.indexOf(gb) >= 0 ) {
          self.data1.diff = block.change.substr(1);
        } else if ('45'.indexOf(gb) >= 0 ) {
          self.data1.diff = "-" + block.change.substr(1);
        }
        self.data1.updnrate = block.drate;
      }
    },
    callbackTCS12(queryData) {
      const self = this;
      let block = queryData.queryObj.OutBlock1[0];
      if (block.kshcode == self.beforeSymbol2) {
        self.data2.closeprc = block.price;
        let gb = block.change[0];
        if ('12'.indexOf(gb) >= 0 ) {
          self.data2.diff = block.change.substr(1);
        } else if ('45'.indexOf(gb) >= 0 ) {
          self.data2.diff = "-" + block.change.substr(1);
        }
        self.data2.updnrate = block.drate;
      }
    },
    getData1() {
      const self = this;
      let header = { trName: 'm1327' };
      let input = {
        InBlock1: [{
          symbol: self.symbol1,
        }]
      }
      self.$socket.sendProcessByName(header, input, function(queryData) {
        if (queryData) {
          if (queryData.queryObj) {
            if (queryData.queryObj.OutBlock2 && queryData.queryObj.OutBlock2.length > 0) {
              let block = queryData.queryObj.OutBlock2[0];
              self.data1 = block;
              console.log(self.getSymbol(self.symbol1));

              self.$socket.registerReal("TCS1", '.Feed', [ block.symbol ], "compareCoin1", self.callbackTCS11);
              self.beforeSymbol1 = block.symbol;
            } else {
              console.error("m1327 OutBlock1 is null");
            }
          } else {
            console.error(queryData.header);
          }
        } else {
          console.error("m1327 is null");
        }
      });
    },
    getData2() {
      const self = this;
      let header = { trName: 'm1327' };
      let input = {
        InBlock1: [{
          symbol: self.symbol2,
        }]
      }
      self.$socket.sendProcessByName(header, input, function(queryData) {
        if (queryData) {
          if (queryData.queryObj) {
            if (queryData.queryObj.OutBlock2 && queryData.queryObj.OutBlock2.length > 0) {
              let block = queryData.queryObj.OutBlock2[0];
              self.data2 = block;

              self.$socket.registerReal("TCS1", '.Feed', [ block.symbol ], "compareCoin2", self.callbackTCS12);
              self.beforeSymbol2 = block.symbol;
            } else {
              console.error("m1327 OutBlock1 is null");
            }
          } else {
            console.error(queryData.header);
          }
        } else {
          console.error("m1327 is null");
        }
      });
    },
    getData() {
      const self = this;
      self.getData1();
      self.getData2();
    }
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

    //리얼데이터 해지 (symbol1)
    if (self.beforeSymbol1 != '') {
      self.$socket.unregisterReal("TCS1", '.Feed', [ self.beforeSymbol1 ], "compareCoin1");
      self.beforeSymbol1 = '';
    }
    if (self.beforeSymbol2 != '') {
      self.$socket.unregisterReal("TCS1", '.Feed', [ self.beforeSymbol2 ], "compareCoin2");
      self.beforeSymbol2 = '';
    }
  }
}
</script>
