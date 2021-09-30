<template>
  <div class="content">

				<div class="info-box">
					<h3 class="title">Strategy-Store on SignalMaker</h3>
					<p v-html="$t('intro.b102.a001m2')"></p><!-- 최고의 투자 전략을<br><span class='color03'>구독하거나 공유</span>할수 있습니다. -->
					<div class="info-step">
						<div class="item"><i class="img"><img src="/static/image/img_info_step01.png" alt=""></i>{{ $t('intro.b101.a002') }}<!-- 구독 --></div>
						<i></i>
						<div class="item"><i class="img"><img src="/static/image/img_info_step02.png" alt=""></i>{{ $t('intro.b102.a003') }}<!-- 설치 --></div>
						<i></i>
						<div class="item"><i class="img"><img src="/static/image/img_info_step03.png" alt=""></i>{{ $t('intro.b102.a004') }}<!-- 시작 --></div>
					</div>

          <div class="youtube">
            <a href="//www.youtube.com/watch?v=qvIz_BXbelY" target="_blank"><img src="//img.youtube.com/vi/qvIz_BXbelY/0.jpg"></a>
          </div>
				</div>
		
	</div>
</template>

<script>
import touchEvent from '@/module/touchEvent'

export default {
  mixins: [touchEvent],
  data() {
    return {
      tabIndex: "0",
    };
  },
  methods: {
    goYoutube(id) {
      window.open('https://www.youtube.com/watch?v='+id);
    },
    changeLangType() {
      const self = this;
      self.$EventBus.$emit("setLogo", {
        type: "",
        text: self.$t('intro.b001') // 서비스 소개
      });
    },
    swipeLeft() {
      const self = this;
      let num = Number(self.tabIndex);
      num = ++num>2?0:num;
      self.tabIndex = ""+num;
    },
    swipeRight() {
      const self = this;
      let num = Number(self.tabIndex);
      num = --num<0?2:num;
      self.tabIndex = ""+num;
    },
  },
  created() {
    const self = this;
    if (self.$route.query.tab) {
      self.tabIndex = '' + self.$route.query.tab;
    }

    self.$EventBus.$emit("setLogo", {
      type: "",
      text: self.$t('intro.b001') // 서비스 소개
    });
    self.$EventBus.$emit("setMenuIndex", "6-2");
      
    self.$EventBus.$on("changeLangType", self.changeLangType);
    self.$EventBus.$on('swipeLeft', self.swipeLeft);
    self.$EventBus.$on('swipeRight', self.swipeRight);
  },
  beforeDestroy() {
    const self = this;
    self.$EventBus.$off("changeLangType", self.changeLangType);
    self.$EventBus.$off('swipeLeft', self.swipeLeft);
    self.$EventBus.$off('swipeRight', self.swipeRight);
  }
}
</script>
