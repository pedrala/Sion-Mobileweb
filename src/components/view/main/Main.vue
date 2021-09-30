<template>
	<div class="content" >
		<div id="step01" class="main-step01">
			<div class="main-visual" >
				<el-carousel ref="carousel" arrow="never" :interval="7000">
					<el-carousel-item  v-bind:style="{ backgroundImage: 'url(./static/image/main/main01.jpg)' }">
            <div class="slide-inner">
							<strong class="title" v-html="'시온은 코인 자동투자 서비스입니다.'"></strong>
						</div>
					</el-carousel-item>
					<el-carousel-item class="slider-02" v-bind:style="{ backgroundImage: 'url(./static/image/main/main02.png)' }">
           	<div class="slide-inner">
							<strong class="title" v-html="'한번만 셋팅해 놓으면 365일 24시간 자동투자가 이루어집니다.'"></strong>
						</div>
					</el-carousel-item>
					<el-carousel-item class="slider-03" v-bind:style="{ backgroundImage: 'url(./static/image/main/main03.jpg)' }">
            <div class="slide-inner">
							<strong class="title" v-html="'알고리즘 투자로 안정적인 수익을 얻습니다.'"></strong>
						</div>
					</el-carousel-item>
					<el-carousel-item >
            <div class="slide-inner" align="center">
							<div class="step-title" >이제 시작해 볼까요?</div>
							<div class="step-title2" >1.거래소 계좌준비</div>
							<div class="step-title2" >2.거래소 API 발급 및 연동</div>
							<div class="step-title2" >3.내게 맞는 투자전략 선택</div>
							<el-button type="primary" @click="start" size="medium" style="margin-top:50px; width:150px;height:50px" >시작하기</el-button>
						</div>
					</el-carousel-item>
				</el-carousel>
			</div>
		</div>

    <el-dialog :visible.sync="item.visible" :close-on-click-modal="false" width="90%" top="0" class="mob modal main modal-type02 modal-headX" v-for="item in popupList" :key="item.popupId" append-to-body>
			<div class="item-modal">
				<div class="section02">
					<div v-if="item.popupType=='I'" class="img">
						<img :src="item.mobileImage" @click="goLink(item)">
					</div>

					<div v-else class="terms">
						<strong class="title">{{ item.subj }}</strong>
						<div v-html="item.conts"></div>
					</div>
					<el-checkbox v-model="item.isChecked" class="checkbox block">{{ nondpPeriodFormat(item.nondpPeriod) }}</el-checkbox>

					<div class="btns full">
						<el-button class="button button-bg03 block" @click="closePopup(item)">{{ $t('common.confirm') }}</el-button>
					</div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { sendApi } from '@/api';
import touchEvent from '@/module/touchEvent'

export default {
  mixins: [touchEvent],
  data() {
    return {
        popupList: [],
        visiblePopup: false,
        visiblePopup2: false,
				isPc: '',
				step2: false,
				step3: false,
				step4: false

    };
  },
  methods: {
    goLink(item) {
      const self = this;
      if (item.isLink == 'Y' && item.mobileLinkUrl) {
        if (item.isPopup == 'Y') {
          window.open(item.mobileLinkUrl);
        } else {
          location.href = item.mobileLinkUrl;
        }
      }
    },
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
    showAlert(val) {
      if (val) {
        const self = this;
        self.$alert(self.$t("main."+val), '', {
          confirmButtonText: self.$t("common.confirm")
        });
      }
	},

	start(){

	},

    moveMenu(route) {
        const self = this;
        if (route == 'popup') {
          self.visiblePopup2 = true;
        } else {
          self.$router.push(route);
        }
      },
		nondpPeriodFormat(val) {
			const self = this;
			if (val) {
				if (val == 1) {
					// 오늘 하루동안 보지 않기
					return self.$t('main.a028');
				} else if (val == 7) {
					// 7일동안 보지 않기
					return self.$t('main.a029');
				}
			} else {
				// 다시 보지 않기
				return self.$t('main.a030');
			}
		},
		closePopup(item) {
			const self = this;

			//보지않기 확인 (쿠키에 저장)
			if (item.isChecked) {
				var expire = Infinity;
				if (item.nondpPeriod == 1) {
					expire = "1d";
				} else if (item.nondpPeriod == 7) {
					expire = "7d";
				}
				self.$cookies.set("SIGNALMAKER_pop" + item.popupId, "Y", expire);
			}

			//리스트에서 제거
			const idx = self.popupList.indexOf(item)
			if (idx > -1) {
				self.popupList.splice(idx, 1);
			}
			if (self.popupList.length <= 0) {
				self.visiblePopup = false;
			}
		},
		popupListCallback(data) {
			console.log("poplist", data);
			if (data) {
				const self = this;
				if (data.list.length > 0) {
					data.list.forEach(item => {
						// item.popupId cookie check
						let val = self.$cookies.get("SIGNALMAKER_pop" + item.popupId);
						if (!val || val != 'Y') {
							item.isChecked = false;
							item.visible = true;
							self.popupList.push(item);
						}
					});
					if (self.popupList.length > 0) {
						self.visiblePopup = true;
					}
				}
			}
		}

  },
  created() {
    const self = this;
    self.$EventBus.$emit("setLogo", {
      type: "main",
      text: "홈"
	});
	self.$EventBus.$emit("setMenuIndex", "0");

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
