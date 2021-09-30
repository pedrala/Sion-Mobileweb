<template>
    <div class="section02">	
         <div style="text-align:center" align=center>  
            <div style="padding: 25px;">             
                <el-upload
                  class="avatar-uploader"               
                  :action="getUploadUrl"    
                  :data="uploadInfo"
                  :show-file-list="false"                  
                  :on-success="handleAvatarSuccess" >
                  <div v-if="getUserInfo.profile_image_url" :style="'background-image:url(' + getUserInfo.profile_image_url + ');'"
                    style="background-position: center; background-size: cover; position: relative; width:100px;height:100px; border-radius:50%; overflow: hidden;">
                  </div>               
                  <div  v-else-if="imageUrl" :style="'background-image:url(' + imageUrl + ');'"
                    style="background-position: center; background-size: cover; position: relative; width:100px;height:100px; border-radius:50%; overflow: hidden;">
                 </div>
                  <div  v-else>
                    <i class="el-icon-plus avatar-uploader-icon"></i> 
                  </div>                                
                </el-upload>            

              <el-form ref="form" class="form">              
                <div class="item">
                  <span class="name">필명</span>
                  <div >
                    <el-input v-model="input_data" class="input" @keyup.native="changenickNm" :class="chkDup | dupClassFormat"><!-- 필명을 입력해주세요 -->
                      <!-- <template slot="suffix">{{ dupFormat(chkDup) }}</template> -->
                    </el-input>
                    <!-- <el-button @click="goDup" class="button">{{ $t('mypage.d101.a005') }}</el-button> -->
                      <!-- 중복확인 -->
                  </div>
                </div>
              </el-form>
              <ul class="bullet bullet-type01 bullet-color02 color04">
                <li>{{ $t('mypage.d101.a006') }}<!-- 필명은 한글/영문/숫자 2~15자리까지 입력이 가능 (혼용가능) --></li>
              </ul>
              <div class="btns">
                <el-button @click="save" class="button button-bg03 block">저장</el-button>
              </div>   
            
            </div>          
          </div>
    </div>		
</template>

<script>
import { mapGetters } from "vuex";
import { uploadFile } from '@/api/upload'
import { sendApi } from '@/api';
import axios from 'axios'
import crypto from 'crypto';

export default {
  computed: {
    ...mapGetters(['getUserInfo', 'isSocketConnected']),
       getUploadUrl() {
        return process.env.IMG_URL + '/upload.php';
      }   
  },
  components: {
        
  },
  data() {
    return {   
      input_data: '',    
      chkDup: 0,  //0: default, 1: 가능, 2: 중복
      profileData: [],          
      imageUrl: '',     //로컬이미지 URL 로 전환하여 임시로 프사에 표시용
      profileImageUrl: '',   //이미지 upload 한 후 응답으로 받는 이미지URL, 실제 URL
      uploadInfo: {
        validkey: 'bc89d2c5W00f1a2b324604KW74030b2521Y4b4Abf30bd4b438a4Fd7ff49',
        regr: ''
      },
      whiteList: ["image/gif", "image/jpeg", "image/png"]   
    };
  },
  filters: {
      dupClassFormat(val) {
        if (val) {
          if (val == 1) {
            return "input-success";
          } else if (val == 2) {
            return "input-error";
          } else {
            return val;
          }
        }
        return "";
      }
    },
  methods: {    
    dupFormat(val) {
      if (val) {
        const self = this;
        if (val == 1) {
          return self.$t('mypage.d101.a007'); // 가능
        } else if (val == 2) {
          return self.$t('mypage.d101.a008'); // 중복
        } else if (val == 0) {
          return '기본';
        }
      }
      return "";
    },
    changenickNm(e) {
      const self = this;
      self.chkDup = 0;
    },
    handleAvatarSuccess(res, file) 
    {
        const self = this; 
        //로컬에서 올린 이미지 노출위해 임시로 사용자정보에서 프로필이미지 삭제
        let token = self.getUserInfo;                 
        token.profile_image_url = ''; 
        // self.getUserInfo.profile_image_url = ''      
        
        //사용자정보의 프로필이미지 대신 로컬에서 올린 이미지 노출
        self.imageUrl =  URL.createObjectURL(file.raw);
        console.log("imageUrl:"+ self.imageUrl);
        console.log("profile_image_url:"+ self.getUserInfo.profile_image_url);       
     
        let tmp = self.whiteList.filter(item => item == file.raw.type);
        if (tmp.length <= 0) 
        {
          // 이미지 파일만 업로드가능합니다.
          self.$alert(self.$t('cs.c039'), '', {
            confirmButtonText: self.$t("common.confirm")
          });       
          return;
        }
        
        if (file.size > 1048576) 
        {
          // 이미지 용량을 초과했습니다. (최대 1MB)
          self.$alert(self.$t('cs.c038'), '', {
            confirmButtonText: self.$t("common.confirm")
          });        
          return;
        }     

        var formData = new FormData();
        formData.append("uploadfile", file.raw);
        formData.append("regr", self.getUserInfo.user_id);
        formData.append("validkey", "bc89d2c5W00f1a2b324604KW74030b2521Y4b4Abf30bd4b438a4Fd7ff49");
        
        axios({
          url: process.env.IMG_URL + "/upload.php",
          method: "POST",
          data: formData
        }).then(result => {
          if (result.data > 0) {
            self.profileImageUrl = process.env.IMG_URL + "/view.php?id=" + result.data; // Get url from response      
            console.log('profileImageUrl:' + self.profileImageUrl);   

          }
        }).catch(err => {      
          console.log(err);
          return;
        });
       
      },
      validatenickNm() {
				const self = this;
				if (self.input_data == '') {
          // 필명을 입력해주세요
					self.$alert(self.$t('mypage.d101.a004'), '', {
						confirmButtonText: self.$t("common.confirm")
					});
				} else if (!/^[a-zA-Z0-9가-힣]{2,12}$/.test(self.input_data)) {
          // 필명은 한글/영문/숫자 2~12까지 가능합니다
					self.$alert(self.$t('mypage.d101.a009'), '', {
						confirmButtonText: self.$t("common.confirm")
					});
				} else {
					return true;
				}
				return false;
      },
     
      save() {
        const self = this;  
        self.$confirm("저장하시겠습니까?" , {
          confirmButtonText: self.$t("common.confirm"),
          cancelButtonText: self.$t("common.cancel"),
          center: true,
        }).then(() => {    
          // 세션값이랑 닉넴 비교
          // 1.같으면 
          // -메시지없이 at332 (이미지 저장)
          // 2.다르면 
          //   1)-at005(닉넴중복체크) 정상 -> at007(필명저장) -> at332(이미지 저장)
          //   2)-at005(닉넴중복체크) 오류 -> 에러메시지 출력
          let token = self.getUserInfo;           
          if (self.input_data == token.user_nnm ) 
          {
              self.chkDup = 2;
              // self.$alert('중복된 필명이 있습니다.', '', {
              //   confirmButtonText: self.$t("common.confirm")
              // });              
              self.updateImage();                  
          }
          else //사용가능
          {
              self.goDup();             
          }
       
        });     
      },   
    
      //중복체크 콜백
			dupCallback(queryData) {
				const self = this;
				if (queryData.queryObj) {
					let output = queryData.queryObj.OutBlock1[0];
					if (output != null) {
            if (output.rslt_cls == '1')
            {
              self.chkDup = 1;        
              self.updatenickNm();  
                    
            }else
            {
               self.chkDup = 2;
               self.$alert(output.rslt_msg, '', {
                confirmButtonText: self.$t("common.confirm")
              });
            }
					}
				} else {
          self.chkDup = 2;
        	self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
            confirmButtonText: self.$t("common.confirm"),
          });
        }
      },
      //중복체크
			goDup() {
				const self = this;
				if (self.validatenickNm()) {
					let header = { trName: 'at005' }
					let input = {
						InBlock1: [{
							check_gb: 2,
							input_data: self.input_data
						}]
          }
          // console.log("at005_input:", JSON.stringify(input));
					self.$socket.sendProcessByName(header, input, function(queryData) {
            console.log("goDup", queryData);
						if (queryData != null) {
							self.dupCallback(queryData);
						}
					});
				}
      },     

      //필명저장 콜백
			updateCallback(queryData) {
				const self = this;

				if (queryData.queryObj) {
					let output = queryData.queryObj.OutBlock1[0];
					if (output != null) {
						if (output.rslt_cls == '1') {      
                       
                  //세션에 닉네임 업데이트        
                  let token = self.getUserInfo;
                  token.user_nnm = self.input_data;              
                  console.log("token_at007:"+JSON.stringify(token))    
                  self.$store.commit("SET_USERINFO", token);       

                  //이미지 저장
                  self.updateImage();
               
						} else {
							let rslt_msg = output.rslt_msg;
							self.$alert(rslt_msg, '', {
								confirmButtonText: self.$t("common.confirm")
							});
						}
					}
				} else {
					self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
            confirmButtonText: self.$t("common.confirm"),
          });
				}
      },
      //필명저장
			updatenickNm() {
        const self = this;    
			
        let header = { trName: 'at007' }
        let input = {
          InBlock1: [{
            enc_user_id: self.getUserInfo.user_id,
            update_gb: 2,
            update_data: self.input_data
          }]
        }
        self.$socket.sendProcessByName(header, input, function(queryData) {
          console.log("updatenickNm", queryData);
          if (queryData != null) {
            self.updateCallback(queryData);
          }
        });
				
      },
      //이미지변경 
      updateImage()
      {    
        const self = this;      
        if (self.validatenickNm()) {
          let header = { trName: 'at332' }
          let input = {
            InBlock1: [{
              enc_user_id	: self.getUserInfo.user_id,
              profile_image_url	: (self.profileImageUrl !='') ? self.profileImageUrl : self.getUserInfo.profile_image_url 
            }]
          }
          
          console.log("at332_input:", JSON.stringify(input));
          self.$socket.sendProcessByName(header, input, function(queryData) {
            console.log("updateImage", queryData);
            if (queryData != null) {
              	if (queryData.queryObj) {       
                   
                  let output = queryData.queryObj.OutBlock1[0];
                  if (output != null) {
                    if (output.rslt_cls == '1') {  
                    
                    self.$alert('저장이 완료되었습니다.', '', {
                          confirmButtonText: self.$t("common.confirm"),
                          callback: function() {   
                              
                            self.$EventBus.$emit('reloadInfo');                           

                            //세션에 이미지 업데이트        
                            self.getUserInfo.profile_image_url = output.profile_image_url  
                            let token = self.getUserInfo;       
                            token.profile_image_url = self.getUserInfo.profile_image_url 
                            console.log("token_at332:"+JSON.stringify(token))    
                            self.$store.commit("SET_USERINFO", token);  
                            sendApi('/user/login', token, null);                                   
                          
                          }                 
                      });                 
                   
                   }
                  }
                } else {
                  
                    self.$alert(output.rslt_msg, '', {
                      confirmButtonText: self.$t("common.confirm")
                    });
                }
            }
            else {              
              self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
                confirmButtonText: self.$t("common.confirm"),
              });
            }
          });
        }
      }
      		
  },  	
    
  created() {  
	  const self = this;
    self.$EventBus.$emit("setLogo", {
      type: "",
      text: "프로필 이미지/필명"
    }); 
    self.uploadInfo.regr = crypto.createHash('sha512').update(self.getUserInfo.user_id).digest('hex');
    if (self.$route.query.nickNm ) 
    {
       self.input_data = self.$route.query.nickNm        
    }
  },
  mounted() {}
}
</script>

 <style>
  .avatar-uploader .el-upload {
    border: 3px dashed #d9d9d9;
    border-radius: 100%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width:100px;
    height:100px;
   
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>
