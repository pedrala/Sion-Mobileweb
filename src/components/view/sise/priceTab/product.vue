<template>
    <!-- 상품개요 -->
    <div class="sise-price-wrap">
      <div class="sise-price-list" style="display:flex; flex-direction:column; background-color:white">
        <h3 class="sise-price-title">
            상품개요
        </h3>
        <div id="sum" style="flex:1; overflow:auto; padding:10px; background-color:white">
            {{ productSummaryData.summary	}}
        </div>
        <!-- <span style="float:right; margin: 20px"> <el-button v-if="visibleBtn" type="primary" size=mini @click="loadMore">더보기</el-button></span> -->
      </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {

  computed: {
    ...mapGetters([ 'isMaster', 'symbols', 'isSocketConnected']),
  },
  props: ['coincd'],
  data() {
    return {
      //상품뉴스
      productSummaryData: [],
      visibleBtn:false
    };
  },
  methods: {
    decodeHtml(str) {
      var map = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#039;': "'"
      };
      return str.replace(/&|<|>|"|&#039;/g, function(m) {return map[m];});
    },
    goLink(url) {
      //url = "http://www.coindeskkorea.com/news/articleView.html?idxno=72113"
      window.open(url);
    },

    loadMore(){
       const self = this;
       self.visibleBtn = false
       var con = document.getElementById("sum");
       con.style.overflow = 'auto';


    },
    //상품개요 조회
    getProductSummary() {
      const self = this;

      let header = { trName: 'at335' }
      let input = {
        InBlock1: [{
          coin_cd	:self.coincd
        }]
      }
     // console.log("input_at335:", input);
      self.$socket.sendProcessByName(header, input, function(queryData) {
     // console.log("getProductSummary:", queryData);
        if (queryData != null) {
          if (queryData.queryObj) {
            let output = queryData.queryObj.OutBlock1[0];
            if (output != null) {
              if (output.rslt_cls == '1') {
                  self.productSummaryData = output;
                 //  console.log("productSummaryDatalength:", self.productSummaryData.summary.length );
                  if(self.productSummaryData.summary.length > 100)
                  {
                      self.visibleBtn = true
                    //  self.productSummaryData.summary = self.productSummaryData.summary.substr(0,100)
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
        }
      });
    },
    getData() {
      const self = this;
      //상품뉴스 조회
      self.getProductSummary();
    }
  },

  mounted() {
    const self = this;
    if (self.isSocketConnected) {
      self.getData();
    }
    self.$EventBus.$on('socketConnected', self.getData);

  },
  beforeDestroy() {
    const self = this;
    self.$EventBus.$off("changeLangType", self.changeLangType);
    self.$EventBus.$off('socketConnected', self.getData);
  }
}
</script>
