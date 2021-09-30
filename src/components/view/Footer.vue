<template>
  <div class="footer">

    <div v-show="isVertical" class="tabs tabs-origin tabs-item05 footer-menu">
	    <el-button v-wave class="button" v-bind:class="{ 'is-active': activeIndex === '0' }" @click="goHome">
        <span class="m-icon">
		      <img :src="activeIndex === '0' ? require('@/images/nav/menu1-w.svg') : require('@/images/nav/menu1.svg')" />
        </span>
        {{'홈'}}
      </el-button>
	    <el-button v-wave class="button" v-bind:class="{ 'is-active': activeIndex === '1' }" @click="goSymbolPrice">
        <span class="m-icon">
          <img :src="activeIndex === '1' ? require('@/images/nav/menu3-w.svg') : require('@/images/nav/menu3.svg')" />
        </span>
        {{'시세&진단'}}
      </el-button>
      <el-button v-wave class="button" v-bind:class="{ 'is-active': activeIndex === '2' }" @click="goAutoTrading">
        <span class="m-icon">
          <img :src="activeIndex === '2' ? require('@/images/nav/menu1-w.svg') : require('@/images/nav/menu1.svg')" /></span>
        {{'전략구매'}}
      </el-button>
      <el-button v-wave class="button" v-bind:class="{ 'is-active': activeIndex === '3' }" @click="goProfile">
        <span class="m-icon">
          <img :src="activeIndex === '3' ? require('@/images/nav/menu4-w.svg') : require('@/images/nav/menu4.svg')" />
        </span>
        {{'프로필'}}
      </el-button>
	   <el-button v-wave class="button" v-bind:class="{ 'is-active': activeIndex === '4' }" @click="goTimeLine">
        <span class="m-icon">
          <img :src="activeIndex === '4' ? require('@/images/nav/menu2-w.svg') : require('@/images/nav/menu2.svg')" />
        </span>
        {{ '더보기' }}
      </el-button>
    </div>

    <terms></terms>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Terms from "./common/Terms";

export default {
  components: {
    Terms
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'isVertical']),
  },
  data() {
    return {
      activeIndex: '0',
    }
  },
  methods:{
		goHome() {
      const self = this;
      if (self.isLoggedIn) {
				self.$router.push('/home/interest');
			} else {
        self.$router.push('/home/taste');
      }
		},
		goAutoTrading() {
			const self = this;
			self.$router.push('/auto/trading');
		},
		goTimeLine() {
			const self = this;
			self.$router.push('/timeLine/notice');
		},
		goSymbolPrice() {
			const self = this;
			self.$router.push('/sise/list');
		},
		goProfile() {
			const self = this;
			self.$router.push('/profile/main');
		},
		goIdpwFind() {
			const self = this;
			self.$router.push('/idpwFind');
		},
		goRegistration() {
			const self = this;
			self.$router.push('/registration');
		},
		setMenuIndex(index) {
			const self = this;
			if (index.length > 1) {
				self.activeIndex = index.substring(0, 1);
			} else {
				if (index == '0') {
				  self.activeIndex = '0';
				} else {
				  self.activeIndex = index;
				}
			}
			//console.log("activeIndex", self.activeIndex);
   	},
	},
	created() {
    const self = this;
		self.$EventBus.$on("setMenuIndex", self.setMenuIndex);
	},
	beforeDestroy() {
		const self = this;
 		self.$EventBus.$off('setMenuIndex', self.setMenuIndex);
	}
}
</script>
