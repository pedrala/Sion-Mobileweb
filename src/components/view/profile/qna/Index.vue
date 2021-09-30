<template> 
    <router-view></router-view>
</template>

<script>
import {mapGetters} from "vuex";
export default {
  	computed: {
			...mapGetters(["isLoggedIn"])
		},
		watch: {
			isLoggedIn(val, old) {
				const self = this;
				if (!val) {
					self.$router.push({ path: '/home/taste' });
				}
			}
		},
  data() {
    return {     
     
    };
  },
  methods: { 
  },
  created() {   
    const self = this;
			let token = {
        curPage: 1,
        q_state: 'N'
			};
			self.$store.commit("setBbsInfo", token);
      localStorage.clear();    
  },
  mounted() {
    
  },
  beforeDestroy() {
  }
}
</script>
