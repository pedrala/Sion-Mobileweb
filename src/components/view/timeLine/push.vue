<template>
  <div>
    <ul style="margin-bottom: 60px;">
      <li v-for="item in list" :key="item.mtextId" style="border: 1px solid #f4f4f4; margin: 5px 5px 5px 5px;padding: 10px 0">
        <div style="width:100%;display:flex;height:40px;">
          <div style="width:60px;line-height:40px;margin: 0 10px;"><img :src="require('@/images/notification.png')" style="height: 30px;" /></div>
          <div>
            <span style="float:left;line-height:20px;">PUSH 알림</span><br><span>{{ item.datetime | dateFormat2 }}</span>
          </div>
        </div>

        <div style="text-align: left;padding: 0 15px;">
          <div style="height: 20px; margin: 10px 0;">
            <span style="line-height: 20px;">{{ item.title }}</span>
          </div>
          <div v-html="item.body" style="white-space: break-spaces;"></div>
        </div>
      </li>
    </ul>

		<infinite-loading v-if="isInfinite" spinner="spiral" ref="infiniteLoading" @infinite="infiniteHandler">
			<div slot="no-more"></div>
			<div slot="no-results">{{ $t("cs.a005") }}<!-- 데이터가 없습니다. --></div>
		</infinite-loading>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import InfiniteLoading from 'vue-infinite-loading';

export default {
  components: {
    InfiniteLoading,
  },
  data() {
    return {
      curPage: 1,
      pageCount: 10,
      list: [],
      isInfinite: false,
    };
  },
  computed: {
    ...mapGetters([ "getUserInfo", "isSocketConnected" ])
  },
  methods: {
    infiniteHandler($state) {
      console.log("infiniteHandler start");

      const self = this;
      let header = { trName: 'at324' }
      let input = {
        InBlock1: [{
          enc_user_id: self.getUserInfo.user_id,
          //enc_user_id: 'iZxE:d2iOo', //test
          page_no: self.curPage,
          page_div_cnt: self.pageCount,
        }]
      }
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("infiniteHandler", queryData);
        if (queryData != null) {
          if (queryData.queryObj) {
            let output = queryData.queryObj.OutBlock1[0];
            if (output != null) {
              if (output.rslt_cls == '1') {
                if (output.out_cnt * 1 > 0) {
                  self.list = self.list.concat(queryData.queryObj.OutBlock2);

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
    getData() {
      const self = this;
      if (self.isInfinite) {
        self.$refs.infiniteLoading.stateChanger.reset();
      } else {
        self.isInfinite = true;
      }
      self.$EventBus.$emit('resetNewCnt');
    },
  },
  created() {
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
    self.$EventBus.$off('socketConnected', self.getData);
  }
}
</script>
