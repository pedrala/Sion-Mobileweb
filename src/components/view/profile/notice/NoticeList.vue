<template>
   <push></push>
</template>

<script>

import push from '@/components/view/timeLine/push.vue';
export default {
  components: {
    push   
  },
  data() {
    return {
     
    };
  },
  methods: {

  },
  created() {
    const self = this;  
    self.$EventBus.$emit("setLogo", {
      type: "",
      text: "알림 내역",
      name: "noticeList"
    });
    self.$EventBus.$emit("setMenuIndex", "3-5");
  },
  mounted() {   
	
  }
}
</script>
