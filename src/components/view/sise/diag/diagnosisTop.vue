<template>
  <div class="event-header">
    <div class="event-header-l">
      <span class="exchange">{{ symbols[symbol].exidnm }}</span>
      <span class="name">{{ symbols[symbol].name }}</span>
      <span class="symbolKr">{{ symbols[symbol].hname }}</span>
    </div>
    <div class="event-header-r">
      <span class="price" :style="{ color: coinColor(data.diff) }">
        {{ data.closeprc | numberFormat2 }}
      </span>
      <div>
        전일대비
        <span :style="{ color: coinColor(data.diff) }">{{ data.updnrate }}%</span>
        <span :style="{ color: coinColor(data.diff) }"><i :class="coinCaret(data.diff)"></i>{{ data.diff | numberFormat2 }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props:[ 'symbol', 'name' ],
  computed: {
    ...mapGetters([ 'isMaster', 'symbols' ]),
  },
  data() {
    return {
      beforeSymbol: '',
      data: {},
    };
  },
  watch: {
    symbol() {
      const self = this;
      if (self.beforeSymbol != '') {
        self.$socket.unregisterReal("TCS1", '.Feed', [ self.beforeSymbol ], self.name);
      }
      self.getData();
    }
  },
  methods: {
    coinColor(val) {
      if (parseFloat(val) > 0) {
        return "#f8696b";
      } else if (parseFloat(val) < 0) {
        return "#409EFF";
      }
      return "";
    },
    coinCaret(val) {
      if (parseFloat(val) > 0) {
        return "el-icon-caret-top";
      } else if (parseFloat(val) < 0) {
        return "el-icon-caret-bottom";
      }
      return "";
    },
    getData() {
      const self = this;

      let header = { trName: 'm1327' };
      let input = {
        InBlock1: [{
          symbol: self.symbol,
        }]
      }

      self.$socket.sendProcessByName(header, input, function(queryData) {
        if (queryData) {
          if (queryData.queryObj) {
            if (queryData.queryObj.OutBlock2 && queryData.queryObj.OutBlock2.length > 0) {
              let block = queryData.queryObj.OutBlock2[0];
              self.data = block;

              self.$socket.registerReal("TCS1", '.Feed', [ block.symbol ], self.name, self.callbackTCS1);
              self.beforeSymbol = block.symbol;
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
    callbackTCS1(queryData) {
      const self = this;
      let block = queryData.queryObj.OutBlock1[0];
      if (block.kshcode == self.beforeSymbol) {
        self.data.closeprc = block.price;
        let gb = block.change[0];
        if ('12'.indexOf(gb) >= 0 ) {
          self.data.diff = block.change.substr(1);
        } else if ('45'.indexOf(gb) >= 0 ) {
          self.data.diff = "-" + block.change.substr(1);
        }
        self.data.updnrate = block.drate;
      }
    },
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
    if (self.beforeSymbol != '') {
      self.$socket.unregisterReal("TCS1", '.Feed', [ self.beforeSymbol ], self.name);
    }
    self.$EventBus.$off("loadMaster", self.getData);
  }
}
</script>
