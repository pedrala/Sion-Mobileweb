<template>
    <!-- 관련뉴스  -->
    <div class="sise-price-wrap">
      <div class="sise-price-list">
        <h3 class="sise-price-title">
          관련뉴스
        </h3>

       <el-table :data="newsData"
            ref="tableRef"
            :show-header="false"
            class="table board-list-table"
            :header-row-style="headerStyle"
            :cell-style="{padding: '0', height: '30px'}"
            style="margin-top: 0px;">
          <el-table-column label="제목" header-align="center" align="left">
            <template slot-scope="scope" >
               <span class="link" @click="goLink(scope.row.url)" v-html="decodeHtml(scope.row.title)"></span>
            </template>
          </el-table-column>
          <el-table-column label="날짜" width="100" header-align="center" align="right">
             <template slot-scope="scope">
               <span class="date">{{ scope.row.date | dateFormat1 }}</span>
             </template>
          </el-table-column>
        </el-table>

        <!-- <infinite-loading v-if="isInfinite" spinner="spiral" ref="infiniteLoading" @infinite="infiniteHandler">
          <div slot="no-more"></div>
          <div slot="no-results"></div>
        </infinite-loading> -->

      </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import InfiniteLoading from 'vue-infinite-loading';
export default {
  components: {
     InfiniteLoading
  },

  computed: {
    ...mapGetters([ 'isMaster', 'symbols', 'isSocketConnected']),
  },

  props: ['coincd'],
  data() {
    return {

      // 관련뉴스
      newsData: [],
      currentPage: 1,
      pageSize: 20,
      total: 0,
      url:''
    };
  },
  methods: {
    headerStyle(row, rowIndex){
      return 'font-size:12px; height:20px'
    },
    decodeHtml(str) {
      var map = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#039;': "'"
      };
      return str.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, function(m) {return map[m];});
    },  
    goLink(url) {
      const self = this;   
      self.url = self.decodeHtml(url);   
      console.log("news url:"+self.url);
     // self.url = "https://www.google.com/url?rct=j&sa=t&url=http://www.digitaltoday.co.kr/news/articleView.html%3Fidxno%3D260709&ct=ga&cd=CAIyHmE3MmZhYWJjZjg2Njg0M2U6Y28ua3I6a286S1I6Ug&usg=AFQjCNF2ti5QQG9s4PsvDT-HOitAk8AFtg"
      self.$EventBus.$emit("downChart"); 
      var nWin = window.open(self.url);
      nWin.onbeforeunload = function() {
        console.log("news url onbeforeunload");
        if (typeof cordova !== 'undefined') {
          ChartManager.destroyAll();
        }
      }
    },

    //관련뉴스 조회
    getNewsData() {
   // infiniteHandler($state) {
      const self = this;
      let header = { trName: 'at336' }
      let input = {
        InBlock1: [{
          coin_cd		: self.coincd,
          page_no:  self.currentPage,
          page_div_cnt: self.pageSize

        }]
      }
      console.log("input_at336:", input);
      self.$socket.sendProcessByName(header, input, function(queryData) {
       console.log("newsData:", queryData);
        if (queryData != null) {
          if (queryData.queryObj) {

            let output = queryData.queryObj.OutBlock1[0];
            self.total = parseInt(queryData.queryObj.OutBlock1[0].out_cnt);

            if (output != null) {
              if (output.rslt_cls == '1') {
                if (output.out_cnt * 1 > 0) {
                    let tmpList = queryData.queryObj.OutBlock2;
                    if (tmpList.length > 0) {
                      self.newsData = self.newsData.concat(tmpList);
                    }
                    self.currentPage += 1;
                  //  $state.loaded();
                } else {
                  // $state.complete();
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
           // $state.complete();
          }
        } else {
         // $state.complete();
        }
      });
    },
    getData() {
      const self = this;
      self.getNewsData();
      // 관련뉴스 조회
      // if (self.isInfinite) {
      //   self.newsData = [];
      //   self.currentPage = 1;
      //   self.$refs.infiniteLoading.stateChanger.reset();
      // } else {
      //   self.isInfinite = true;
      // }
    }
  },

  beforeMount() {
    const self = this;
  },
  mounted() {
    const self = this;
    if (self.isSocketConnected) {
      self.getData();
    }
    self.$EventBus.$emit("upChart"); 
    self.$EventBus.$on('socketConnected', self.getData);

  },
  beforeDestroy() {
    const self = this;
    self.$EventBus.$off("changeLangType", self.changeLangType);
    self.$EventBus.$off('socketConnected', self.getData);
  }
}
</script>

<style lang="scss" scoped>
.content  {
  padding-bottom: 0px;
}
</style>
