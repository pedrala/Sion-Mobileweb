<template>
  <div style="flex:1; display: flex; flex-direction: column;">
    <div class="block" style="flex:2">
      <interestCoin></interestCoin>
    </div>
    <div style="margin-top:10px;margin-bottom:5px; flex: 1;">
      <interestStra></interestStra>
    </div>
  </div>
</template>

<script>
import interestCoin from "./interestCoin";
import interestStra from "./interestStra";
import touchEvent from '@/module/touchEvent'

export default {
  mixins: [touchEvent],
  components: {
    interestCoin,
    interestStra
  },
  data() {
    return {
    };
  },
  methods: {
    swipeLeft() {
      const self = this;
      self.$refs.carousel.pauseTimer();
      self.$refs.carousel.next();
      self.$refs.carousel.startTimer();
    },
    swipeRight() {
      const self = this;
      self.$refs.carousel.pauseTimer();
      self.$refs.carousel.prev();
      self.$refs.carousel.startTimer();
    },
  },
  mounted() {
    const self = this;
  },
  created() {
    const self = this;
    self.$EventBus.$on('swipeLeft', self.swipeLeft);
    self.$EventBus.$on('swipeRight', self.swipeRight);
  },
  beforeDestroy() {
    const self = this;
    self.$EventBus.$off('swipeLeft', self.swipeLeft);
    self.$EventBus.$off('swipeRight', self.swipeRight);
  }
}
</script>
