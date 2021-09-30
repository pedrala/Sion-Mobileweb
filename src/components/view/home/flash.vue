<template>
  <div>
    <div id="step01" class="main-step01">
			<div class="home-visual">
				<el-carousel ref="carousel" arrow="never" :interval="5000" style="height:60px;">
					<el-carousel-item style="width:100%;" v-bind:style="{ backgroundImage: 'url(./static/image/main/home01.png)' }">
            <div class="slide-inner" style="margin-top:10px">
							<strong  v-html="'시온은 코인 자동투자 서비스입니다.'"></strong>
						</div>
					</el-carousel-item>
					<el-carousel-item v-bind:style="{ backgroundImage: 'url(./static/image/main/home02.png)' }">
           	<div class="slide-inner" style="margin-top:10px">
							<strong  v-html="'한번만 셋팅해 놓으면 365일 24시간 자동투자가 이루어집니다.'"></strong>
						</div>
					</el-carousel-item>
					<el-carousel-item  v-bind:style="{ backgroundImage: 'url(./static/image/main/home03.png)' }">
            <div class="slide-inner" style="margin-top:10px">
							<strong  v-html="'알고리즘 투자로 안정적인 수익을 얻습니다.'"></strong>
					 	</div>
					</el-carousel-item>
				</el-carousel>
			</div>
		</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import touchEvent from '@/module/touchEvent'
import { sendApi } from '@/api';

export default {
  mixins: [touchEvent],

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
<style lang="scss" scoped>

.mob {
  .home-visual {
    .el-carousel__container {
      height: 60px !important;
      min-height:60px;
    }
  }
}
</style>
