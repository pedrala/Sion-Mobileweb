<template> 

  <el-dialog :visible.sync="visibleQRcode" width=100% height=500px top="20px" :lock-scroll="true"  :show-close="true" append-to-body>
            
        <p class="error" style="width:300px">{{ error }}</p>
        <p class="decode-result">Last result: <b>{{ result.apiKey }}</b></p>     <!-- 디코드된 QR코드(apiKey) 출력 -->         
        <qrcode-stream @decode="onDecode" @init="onInit" style="width:300px;height:500px"></qrcode-stream>    <!-- 카메라화면 나옴 --> 

  </el-dialog>
</template>

<script>
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'//QR코드리더
//gruhn.github.io/vue-qrcode-reader
//https://www.npmjs.com/package/vue-qrcode-reader
//npm install vue-qrcode-reader

export default {
  data() {
    return {    
      visibleQRcode:false,
      result: [],
      error: '' 
     
    };
  },
  components: {
    QrcodeStream,  //accesses the device camera and continuously scans incoming frames.
    QrcodeDropZone, //renders to an empty region where you can drag-and-drop images to be decoded.
    QrcodeCapture //is a classic file upload field, instantly scanning all files you select.    
  },
 
  methods: { 
    openQRcodeScanner(){
      const self = this;
      self.visibleQRcode = true

    },
    onDecode (result) {
      const self = this;
      self.result = result
      self.$EventBus.$emit("getApiSecretKey", result);    
      self.visibleQRcode = false
    },

    async onInit (promise) {
      try {
        await promise
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.error = "ERROR: you need to grant camera access permisson"
        } else if (error.name === 'NotFoundError') {
          this.error = "ERROR: no camera on this device"
        } else if (error.name === 'NotSupportedError') {
          this.error = "ERROR: secure context required (HTTPS, localhost)"
        } else if (error.name === 'NotReadableError') {
          this.error = "ERROR: is the camera already in use?"
        } else if (error.name === 'OverconstrainedError') {
          this.error = "ERROR: installed cameras are not suitable"
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.error = "ERROR: Stream API is not supported in this browser"
        }
      }
    },

    handleClose(){

    }
  },
  created() {  
     const self = this; 
     self.$EventBus.$on("openQRcodeScanner", self.openQRcodeScanner);
    
  }, 
  beforeDestroy() {
     const self = this;
     self.$EventBus.$off("openQRcodeScanner", self.openQRcodeScanner);
  }
}
</script>
<style scoped>
  .error {
    font-weight: bold;
    color: red;
  }
</style>