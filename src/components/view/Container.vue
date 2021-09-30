<template>
	<el-container style="padding-top: 45px;">
		<el-header>
			<Header></Header>
		</el-header>
		<el-main style="height:100%;">
      <transition name="fade" mode="out-in">
			  <router-view />
      </transition>
		</el-main>
		<el-footer >
			<Footer></Footer>
		</el-footer>
	</el-container>
</template>

<style lang="css" src="@/styles/common.css"></style>
<style lang="scss"> @import '../../styles/content'; </style>

<script>
import Header from './Header.vue';
import Footer from './Footer.vue';

export default {
  components: {
    Header,
    Footer
  },
  data() {
    return {

    }
  },
  methods: {
  },
  created() {
  },
  beforeDestroy() {
  }
}
</script>
