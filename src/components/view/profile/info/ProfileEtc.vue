<template>
    <div class="section02">	
				<div class="form form-modify full">
         <div class="item">
            <div class="in-button">
              <span class="name">회원탈퇴</span>						
							<el-button @click="askDropUser" class="button">></el-button>		      
            </div>
          </div>
				</div>

    </div>		
</template>

<script>
import { sendApi } from '@/api';
import { mapGetters } from "vuex";

export default {
  props: ['email'],
  computed: {
    ...mapGetters(['getUserInfo', 'isSocketConnected'])
  },
  components: {
   // DropUser    
  },
  data() {
    return {   
    };
  },
  methods: {  
    askDropUser() {
      const self = this;      
      self.$router.push({name: "ProfileInfoDrop"});    
    } 
  },
  created() {  
	  const self = this;
    self.$EventBus.$emit("setLogo", {
      type: "",
      text: "기타"
    }); 
    self.$EventBus.$on("changeLangType", self.changeLangType);	
  },
  mounted() {},
  beforeDestroy() {    

  }
}
</script>
