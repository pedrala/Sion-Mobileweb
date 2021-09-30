<template>
  <section></section>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(['getUserInfo', 'isSocketConnected'])
  },
  data() {
    return {
      name: "Sample"
    };
  },
  methods: {
    callback(queryData) {
      console.log("callback", queryData);
      const self = this;

      if (queryData.queryObj) {
        let output = queryData.queryObj.OutBlock1[0];
        if (output != null) {
          if (output.rslt_cls == '1') {
            self.list = queryData.queryObj.OutBlock2;
          } else {
            let rslt_msg = output.rslt_msg;
            self.$alert(rslt_msg, '', {
              confirmButtonText: '확인'
            });
          }
        }
      } else {
        let header = queryData.header;
        if (header) {
          console.log("["+header.errCode+"] "+header.errMsg);
        }
      }
    },
    getData() {
      return;

      const self = this;

      let header = {
        trName: ''
      }

      let input = {
        InBlock1: [{
        }]
      }

      self.$socket.sendProcessByName(header, input, function(queryData) {
        if (queryData != null) {
          self.callback(queryData);
        }
      });
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
