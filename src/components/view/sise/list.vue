<template>
  <div>
    <el-row class="sise-header">
      <el-col :span="12">
        <el-select v-model="exid" @change="onChangeExid" size="small" placeholder="거래소선택" style="width: 100%;">
          <el-option v-for="item in exchanges" :key="item.vexid" :label="item.vexidnm" :value="item.vexid"></el-option>
        </el-select>
      </el-col>
      <el-col :span="12" style="border-left:1px solid #dadada;">
        <el-select v-model="coin" @change="onChangeCoin" size="small" placeholder="코인선택" style="width: 100%;">
          <el-option v-for="item in coins" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-col>
    </el-row>

    <div class="product-list">
			<ul>
        <li class="product-list-header">
          <div class="col" v-if="coin">거래소</div>
          <div :class="coin ? 'col' : 'col coin'">종목<span>(거래량)</span></div>
          <div class="col">가격<span>(마켓통화)</span></div>
          <div class="col">변동<span>(전일대비)</span></div>
        </li>
        <row v-for="item in listData" :item="item" :key="item.symbol" :coin="coin" :from="from"></row>
			</ul>
		</div>

    <!-- <el-table :data="listData" row-key="symbol" @row-click="moveDetailPage" class="price-table" lazy>
      <el-table-column v-if="coin != ''" label="거래소" min-width="70" align="left">
        <template slot-scope="scope">
          <el-col :span="19">{{ scope.row.vexid | exchangeName }}</el-col>
        </template>
      </el-table-column>
      <el-table-column min-width="130" align="left">
        <template slot="header" slot-scope="scope">
          종목<span>(거래량)</span>
        </template>
        <template slot-scope="scope">
          <div class="price-title">
            <div class="price-title-img">
              <img :src="getCoinImage(scope.row.coincd)" />
            </div>
            <div class="price-title-info">
              {{ scope.row.coincd }} {{ scope.row.moneycd }}
              <span>{{ scope.row.cumdealqty | numberFormat2 }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column min-width="70" align="left">
        <template slot="header" slot-scope="scope">
          가격<span>(마켓통화)</span>
        </template>
        <template slot-scope="scope">
          <div class="price-market">
            {{ scope.row.closeprc | numberFormat2 }}
            <span>({{ scope.row.moneycd }})</span>
          </div>

        </template>
      </el-table-column>
      <el-table-column min-width="70" align="left">
        <template slot="header" slot-scope="scope">
          변동<span>(전일대비)</span>
        </template>
        <template slot-scope="scope">
          <span class="comparison" :style="{ color: scope.row.gb=='+'?'#f8696b':scope.row.gb=='-'?'#409EFF':'' }">{{ scope.row.updnrate }}%</span>
        </template>
      </el-table-column>
    </el-table> -->
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import row from "./row.vue";

export default {
  components: {
    row,
  },
  computed: {
    ...mapGetters([ 'isMaster', 'exchanges', 'coins', 'currentExid', 'currentCoin', 'getCoinImage', 'getUserInfo' ])
  },
  data() {
    return {
      exid: '',
      coin: '',
      beforeSymbols: [],

      listData: [],
      listMap: [],  // 데이터 키/값
      from: ''
    };
  },
  methods: {
    onChangeCoin() {
      const self = this;
      self.exid = '';
      self.$store.commit("setCurrentExid", self.exid);
      self.$store.commit("setCurrentCoin", self.coin);

      if (self.beforeSymbols.length > 0) {
        self.$socket.unregisterReal("TCS1", '.Feed', self.beforeSymbols, "sise");
      }
      self.getData();
    },
    onChangeExid() {
      const self = this;
      self.coin = '';
      self.$store.commit("setCurrentExid", self.exid);
      self.$store.commit("setCurrentCoin", self.coin);

      if (self.beforeSymbols.length > 0) {
        self.$socket.unregisterReal("TCS1", '.Feed', self.beforeSymbols, "sise");
      }
      self.getData();
    },
    callbackTCS1(queryData) {
      const self = this;
      let ob = queryData.queryObj.OutBlock1[0];
      self.listMap[ob.kshcode].closeprc = ob.price;
      if ('45'.indexOf(ob.change[0]) >= 0) {
        self.listMap[ob.kshcode].gb = '-';
      } else if ('12'.indexOf(ob.change[0]) >= 0) {
        self.listMap[ob.kshcode].gb = '+';
      } else {
        self.listMap[ob.kshcode].gb = '';
      }
      self.listMap[ob.kshcode].closeprc = ob.price;
      self.listMap[ob.kshcode].updnrate = ob.drate;
      self.listMap[ob.kshcode].cumdealqty = ob.volume;
    },
    getData() {
      const self = this;
      if (self.currentExid != '') {
        self.exid = self.currentExid;
      } else if (self.currentCoin != '') {
        self.coin = self.currentCoin;
      } else {
        self.exid = self.exchanges[0].vexid;
        self.$store.commit("setCurrentExid", self.exid);
      }

      let header = { trName: 'm1327' };
      let input = {
        InBlock1: [{
          vexid: self.exid,
          symbol: '',
          coincd: self.coin,
        }]
      }
      self.$socket.sendProcessByName(header, input, function(queryData) {
        if (queryData) {
          if (queryData.queryObj) {
            if (queryData.queryObj.OutBlock1 && queryData.queryObj.OutBlock1.length > 0) {
              self.data = queryData.queryObj.OutBlock1[0];
              let list = queryData.queryObj.OutBlock2;

              self.beforeSymbols = [];
              self.listMap = {};
              self.listData = [];
              list.forEach(item => {
                item.gb = item.diff>0?'+':item.diff<0?'-':'';
                self.listData.push(item);
                self.listMap[item.symbol] = item;
                self.beforeSymbols.push(item.symbol);
              })

              //registerReal
              if (self.beforeSymbols.length > 0) {
                self.$socket.registerReal("TCS1", '.Feed', self.beforeSymbols, "sise", self.callbackTCS1);
              }
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

  },
  created() {
    const self = this;
    self.$EventBus.$emit("setLogo", {
      type: "",
      text: "시세&진단"
    });
    self.$EventBus.$emit("setMenuIndex", "1");
  },
  mounted() {
    const self = this;
    if (self.$route.query.inter == "registerCoin") {
      //상단탭비노출
      self.$EventBus.$emit('hideTab');
      self.from = self.$route.query.inter;
    }
    self.$store.commit("setCurrentExid", '021'); //기본거래소 바이낸스로 세팅

    if (self.isMaster) {
      self.getData();
    }
    self.$EventBus.$on("loadMaster", self.getData);
  },
  beforeDestroy() {
    const self = this;
    self.$EventBus.$off("loadMaster", self.getData);

    if (self.beforeSymbols.length > 0) {
      self.$socket.unregisterReal("TCS1", '.Feed', self.beforeSymbols, "sise");
    }
  }
}
</script>

