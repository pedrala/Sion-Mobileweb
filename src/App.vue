<template>
	<div id="app">
		<view-container class="mob"></view-container>

		<!-- 서버 자동주문 종료에 따른 팝업 -->
		<el-dialog :title="nt02Data.title" :visible.sync="visibleNT02" :width="isPc=='Y'?'500px':'100%'" :top="isPc=='Y'?'15%':'0'" :close-on-click-modal="false" :class="isPc=='Y'?'pc modal':'mob modal'">
			<div class="section">

				<div v-if="nt02Data.noti_gbn=='1'">
					<div class="table table-row">
						<table>
							<colgroup>
								<col style="width: 160px;">
								<col>
							</colgroup>
							<tbody>
								<tr>
									<th scope="row">{{ $t('app.a001') }}<!-- 서비스명 --></th>
									<td>{{ nt02Data.service_nm }}</td>
								</tr>
								<tr>
									<th scope="row">{{ $t('app.a002') }}<!-- 전략명 --></th>
									<td>{{ nt02Data.signal_nm }}</td>
								</tr>
								<tr>
									<th scope="row">{{ $t('app.a003') }}<!-- 종료일시 --></th>
									<td>{{ '' + nt02Data.mdate + nt02Data.mtime | dateFormat2 }}</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="msg-text alignC" style="margin-bottom: 0;">
						<strong class="title" v-html="$t('app.a004')">
						</strong><!-- 서버 전략이 <span class='color02'>비정상 종료</span>되었습니다. -->
						<p class="etc color04">* {{ $t('app.a005') }}<!-- 잔고를 확인 후, 보유중인 잔고에 대하여 청산 여부를 결정해주세요. --></p>
					</div>
					<ul class="bullet bullet-type01 bullet-color02">
						<li>{{ $t('app.a006') }}<!-- 문의 --> : 02-761-6446</li>
					</ul>
					<div class="btns alignC">
						<el-button class="button button-bg03" @click="visibleNT02=false">{{ $t('common.confirm') }}</el-button>
					</div>
				</div>

				<div v-if="nt02Data.noti_gbn=='2'">
					<div class="table table-row">
						<table>
							<colgroup>
								<col style="width: 35%;">
								<col>
							</colgroup>
							<tbody>
								<tr>
									<th scope="row">{{ $t('app.a001') }}<!-- 서비스명 --></th>
									<td>{{ nt02Data.service_nm }}</td>
								</tr>
								<tr>
									<th scope="row">{{ $t('app.a002') }}<!-- 전략명 --></th>
									<td>{{ nt02Data.signal_nm }}</td>
								</tr>
								<tr>
									<th scope="row">{{ $t('app.a003') }}<!-- 종료일시 --></th>
									<td>{{ '' + nt02Data.mdate + nt02Data.mtime | dateFormat2 }}</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="msg-text alignC" style="margin-bottom: 0;">
						<strong class="title" v-html="$t('app.a007')">
						</strong><!-- 사용할 수 있는 포인트 부족으로<br>주문이 불가합니다. <span class='color02'>포인트를 충전</span>해주세요. -->
						<p class="etc color04">* {{ $t('app.a005') }}<!-- 잔고를 확인 후, 보유중인 잔고에 대하여 청산 여부를 결정해주세요. --></p>
					</div>
					<ul class="bullet bullet-type01 bullet-color02">
						<li>{{ $t('app.a006') }}<!-- 문의 --> : 02-761-6446</li>
					</ul>
					<div class="btns alignC">
						<el-button class="button button-bg03" @click="visibleNT02=false">{{ $t('common.confirm') }}</el-button>
					</div>
				</div>
			</div>
		</el-dialog>

		<el-dialog v-if="isPc=='Y'" :visible.sync="visibleMSGP" width="500px" top="15%" :show-close="false" :close-on-click-modal="false" class="pc modal modal-headX">
			<div class="caution">
				<h2 slot="title" class="title alignC">{{ msgpData.title }}</h2>
				<div style="white-space: pre;">{{ msgpData.cntnt }}</div>
				<div class="btns alignC">
					<el-button class="button button-bg03" @click="visibleMSGP=false">{{ $t('common.confirm') }}</el-button>
				</div>
			</div>
		</el-dialog>

   		 <el-dialog v-else :visible.sync="visibleMSGP" width="80%" top="0" :show-close="false" :close-on-click-modal="false" class="mob modal modal-headX modal-type02" append-to-body>
			<div class="modal-body">
				<div class="inner">
					<h2 class="title alignC" style="margin-bottom: 20px;">{{ msgpData.title }}</h2>
					<div style="white-space: pre;">{{ msgpData.cntnt }}</div>
					<div class="btns full">
						<el-button class="button button-bg06 block" @click="visibleMSGP=false">{{ $t('common.confirm') }}</el-button>
					</div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import Vue from 'vue'
import "element-ui/lib/theme-chalk/index.css";
import ViewContainer from "@/components/view/Container.vue";
import { detect } from "detect-browser";
import MobileDetect from 'mobile-detect';
import { Loading } from 'element-ui';

export default {
  components: {
    ViewContainer,
  },
  data() {
    return {
      isSendLoginData: false,
      isPc: true,
      nt02Data: {},
      visibleNT02: false,
      msgpData: {},
      visibleMSGP: false,
      bef_user_id: '',
      loading: null,

      chkMaster: {
        m1321: false,
        m1322: false,
      }
    }
  },
  computed: {
    ...mapGetters([ "getUserInfo", "isLoggedIn", "isSocketConnected", "getIsDrop", "isMaster" ])
  },
  watch: {
    isSocketConnected(val, old) {
      const self = this;
      console.log("isSocketConnected", val, self.isLoggedIn);
      if (val) {
        //소켓연결 이벤트 발생
        console.log("emit socketConnected");
        self.$EventBus.$emit("socketConnected");

        //방문자 로그
        self.sendVister();

        //로그인 되어 있는 경우 로그인 정보 전달
        if (self.isLoggedIn) {
          self.sendLoginInfo();
        }
      }
    },
    isLoggedIn(val, old) {
      const self = this;
      console.log("isLoggedIn", val, self.isSocketConnected);
      if (val) {
        if (self.isSocketConnected) {
          self.sendLoginInfo();
        }
      } else {
        self.sendLogoutInfo();
      }
    }
  },
  methods: {
    sendVister() {
      try {
        const self = this;
        let ipaddr = ip();
        let browser = detect();
        let md = new MobileDetect(window.navigator.userAgent);

        let header = {
          trName: 'at094'
        };
        let input = {
          InBlock1: [{
            ipaddr: ipaddr,
            browser: browser.name,
            channel: md.mobile() ? '21' : '20',
          }]
        }
        self.$socket.sendProcessByName(header, input, function(queryData) {
          console.log("sendVister", queryData);
        });
      } catch (err) {
        console.log(err);
      }
    },
    sendLogoutInfo() {
      console.log("sendLogoutInfo");

      const self = this;

      //로그아웃 정보 전달 (to: MCA)
      self.$socket.sendXtLogoutData();

      //push 해지
      if (self.bef_user_id != '') {
        self.$socket.unregisterRealPush(self.bef_user_id);
        self.bef_user_id = '';
      }

      //Push 긴급메세지 등록
      self.$socket.unregisterReal("MSGP", '.Push', null, "App");

      //Push 서버자동주문중지 해지
      self.$socket.unregisterReal("NT02", '.Push', null, "App");

      //Push 언어팩변경 해지
      self.$socket.unregisterReal("NT05", '.Push', null, "App");

      //Push 회원탈퇴처리 해지
      self.$socket.unregisterReal("NT06", '.Push', null, "App");
    },
    sendLoginInfo() {
      console.log("sendLoginInfo");

      const self = this;

      //로그인 정보 전달 (to: MCA)
      self.$socket.sendXtLoginData(self.getUserInfo);

      //로그인 정보 전달 (to: Server)
      let header = { trName: 'at098' }
      let input = {
        InBlock1: [{
          EncUserId: self.getUserInfo.user_id,
          SesnId: self.getUserInfo.sess_id,
        }]
      }
      self.$socket.sendProcessByName(header, input, function(queryData) {
        console.log("sendLoginInfo", queryData);
        if (!queryData.queryObj) {
          if (queryData.header.errCode == '30004') {
            // 로그아웃
            self.$EventBus.$emit('logout');
            self.$alert(self.$t("sys_err." + queryData.header.errCode), '', {
              confirmButtonText: self.$t("common.confirm"),
            });
          }
        }
      });

      //Push 긴급메세지 등록
      self.$socket.registerReal("MSGP", '.Push', null, "App", self.callbackMSGP);

      //Push 서버자동주문중지 등록
      self.$socket.registerReal("NT02", '.Push', null, "App", self.callbackNT02);

      //Push 언어팩변경 등록
      self.$socket.registerReal("NT05", '.Push', null, "App", self.callbackNT05);

      //Push 회원탈퇴처리 등록
      self.$socket.registerReal("NT06", '.Push', null, "App", self.callbackNT06);

      // push 등록
      self.$socket.registerRealPush(self.getUserInfo.user_id);

      self.bef_user_id = self.getUserInfo.user_id;
    },
    callbackNT02(querydata) {
      console.log("app callbackNT02", querydata);
      const self = this;
      if (querydata && querydata.queryObj) {
        var outblock = querydata.queryObj.OutBlock1[0];
        if (outblock) {
          if (outblock.key_user_id == self.getUserInfo.user_id) {
            if (outblock.signal_state == 'N') {
              self.nt02Data = outblock;
              if (self.nt02Data.noti_gbn == '1') {
                self.nt02Data.title = self.$t('app.a008'); // 서버 전략 비정상 종료
                self.visibleNT02 = true;
              } else if (self.nt02Data.noti_gbn == '2') {
                self.nt02Data.title = self.$t('app.a009'); // 포인트 충전 안내
                self.visibleNT02 = true;
              }
            }
          }
        }
      }
    },
    callbackNT05(querydata) {
      console.log("callbackNT05", querydata);
      const self = this;
      if (querydata && querydata.queryObj) {
        var outblock = querydata.queryObj.OutBlock1[0];
        if (outblock) {
          if (outblock.key_user_id == self.getUserInfo.user_id) {
            self.$EventBus.$emit("pushLangType", outblock.lang_pack);
          }
        }
      }
    },
    callbackNT06(querydata) {
      console.log("callbackNT06", querydata);
      const self = this;
      if (querydata && querydata.queryObj) {
        var outblock = querydata.queryObj.OutBlock1[0];
        if (outblock) {
          if (outblock.key_user_id == self.getUserInfo.user_id) {
            self.$EventBus.$emit("logout");
            if (!self.getIsDrop) {
              self.$EventBus.$emit('downChart');              
              self.$alert(self.$t("sys_err.30004"), '', {
                confirmButtonText: self.$t("common.confirm"),
                callback: action => {
									self.$EventBus.$emit('upChart');
								}
              });
            }
          }
        }
      }
    },
    callbackMSGP(querydata) {
      console.log("callbackMSGP", querydata);
      const self = this;
      if (querydata && querydata.queryObj) {
        var outblock = querydata.queryObj.OutBlock1[0];
        self.msgpData = outblock;
        self.visibleMSGP = true;
        if (outblock) {
          if (outblock.key_user_id == self.getUserInfo.user_id) {
            self.visibleMSGP = true;
          }
        }
      }
    },
    /* ---------------------------------------------------------------
   codepush check for update */
   codePushCheck() {
      const self = this;
      console.log('check for codepush update:'+window.codePush);
      
      var updateDialogOptions = {
          updateTitle: "Update",
          mandatoryUpdateMessage: "SiON 최신버전이 출시되어 업데이트가 필요합니다.",
          mandatoryContinueButtonLabel: "설치하기",
          optionalUpdateMessage: "업데이트가 가능합니다. 진행하시겠습니까?",
          optionalIgnoreButtonLabel: "No",
          optionalInstallButtonLabel: "Yes",
      };

      var syncOptions = {
          installMode: 1, //window.codePush.InstallMode.ON_NEXT_RESTART
          mandatoryInstallMode: 0, //window.codePush.InstallMode.IMMEDIATE
          updateDialog: updateDialogOptions
      };
      
      var syncStatusCallback = function (syncStatus) {
          switch (syncStatus) {
              // Result (final) statuses
              case 1://window.codePush.SyncStatus.UPDATE_INSTALLED:
                  self.$alert("SiON 업데이트", '', {
                    confirmButtonText: "Restart your app to complete the update."
                  });
                  break;
              case 0://window.codePush.SyncStatus.UP_TO_DATE:
                  self.$alert("SiON 업데이트", '', {
                    confirmButtonText: "Your application is up to date."
                  });
                  break;
              case 2://window.codePush.SyncStatus.UPDATE_IGNORED:
                  console.log("The user decided not to install the optional update.");
                  break;
              case 3://window.codePush.SyncStatus.ERROR:
                  self.$alert("SiON 업데이트", '', {
                    confirmButtonText: "Something went wrong. Try restarting your app."
                  });
                  break;

              // Intermediate (non final) statuses
              case 5://window.codePush.SyncStatus.CHECKING_FOR_UPDATE:
                  console.log("Checking for update.");
                  break;
              case 6://window.codePush.SyncStatus.AWAITING_USER_ACTION:
                  console.log("Alerting user.");
                  break;
              case 7://window.codePush.SyncStatus.DOWNLOADING_PACKAGE:
                  console.log("Downloading package.");
                  break;
              case 8://window.codePush.SyncStatus.INSTALLING_UPDATE:
                  console.log("Installing update");
                  break;
          }
      };

      // window.codePush.sync(syncStatusCallback, syncOptions);
      // window.codePush.notifyApplicationReady();
      // Migrate data from older versions
        window.codePush.getCurrentPackage(function (currentPackage) {
            // getCurrentPackage returns null if no update was installed (binary version)
            // if (currentPackage && currentPackage.isFirstRun) {
            //     // First run after an update, migrate data
            //     if (currentPackage.appVersion === "1.0.0") {
            //         // migrate data from binary version to version 1.0.0
            //     } else if (currentPackage.appVersion === "2.0.0") {
            //         // migrate data to version 2.0.0
            //     }
            // }
            
            // continue application initialization
            // receivedEvent('deviceready');
            
            // Wait for 5s after the application started and check for updates.
            // setTimeout(self.checkAndInstallUpdates, 5000);
            self.checkAndInstallUpdates();
            
            // Notify the plugin that update succeeded.
            // window.codePush.notifyApplicationReady();            

        }, self.getErrorHandler("Error while retrieving the current package."));
      // cordova.exec(syncStatusCallback,null,'CodePush','install');
    },
    // Uses the CodePush service configured in config.xml to check for updates, prompt the user and install them.
    checkAndInstallUpdates() {
        
        // Check the CodePush server for updates.
        self = this;
        console.log("Checking for updates....");
        window.codePush.checkForUpdate(self.checkSuccess, self.getErrorHandler("Checking for update failed."));
    },
    downloadProgress (progress) { 
      // if(progress) {
        console.log("app codepush Downloaded:"+progress.receivedBytes+" of"+ progress.totalBytes);
      //  self.$message(`Downloaded ${progress.receivedBytes} of ${progress.totalBytes}`)  
      // }      
    },
    // Called after the CodePush server responded the checkForUpdate call
    checkSuccess (remotePackage) {
      self = this;      
        if (!remotePackage) {
            // A null remotePackage means that the server successfully responded, but there is no update available.
            self.$EventBus.$emit('upChart');
            console.log("The application is up to date.");
        }
        else {
            console.log("There is an update available. Remote package:" + JSON.stringify(remotePackage));
            self.$EventBus.$emit('downChart');
            // var downloadProgress = function(progress) {
            //   console.log("codepush Downloaded:"+progress.receivedBytes+" of"+ progress.totalBytes);
            // }
            
            if(remotePackage.isMandatory == false) {              
              Vue.prototype
                .$confirm("SiON 최신버전이 출시되어 업데이트가 필요합니다.", "", {
                  confirmButtonText: "설치하기",
                  cancelButtonText: "나중에"
                })
                .then(() => {
                  console.log("Downloading package...");
                  self.$EventBus.$emit('downChart');
                  self.loading = this.$loading({
                    lock: true,
                    text: 'SiON 최신버전으로 업데이트 중입니다.',
                    spinner: 'el-icon-loading',
                    background: 'rgba(20, 83, 175, 1.0)'
                  });

                  setTimeout(() => {
                    if(self.loading) self.loading.close();
                    self.$EventBus.$emit('upChart');
                  }, 60000);

                  remotePackage.download(self.onDownloadSuccess, self.getErrorHandler("Downloading the update package failed."), self.downloadProgress);
                })
                .catch(() => {
                  self.$EventBus.$emit('upChart');    
                });
              // self.$EventBus.$emit('downChart');
            } else { 
              //강제업데이트
              self.$EventBus.$emit('downChart');
              self.loading = this.$loading({
                lock: true,
                text: 'SiON 최신버전으로 업데이트 중입니다.',
                spinner: 'el-icon-loading',
                background: 'rgba(20, 83, 175, 1.0)'
              });

              console.log("Mandatory Downloading package......");
              remotePackage.download(self.onDownloadSuccess, self.getErrorHandler("Downloading the update package failed."), self.downloadProgress);
            }

            //codePush 콜백함수가 작동하지 않아, 5초후 무조건 중지한다.(loading 화면이 없어지지 않을 경우 처리)
            self.$EventBus.$emit('downChart');
            setTimeout(() => {
              if(self.loading) self.loading.close();
              self.$EventBus.$emit('upChart');
            }, 3000);
         }                
    },
    
    // Called after an update package was downloaded sucessfully.
    onDownloadSuccess (localPackage) {
        self = this;
        console.log("app Local package downloaded. Local package: " + localPackage.localPath);
        console.log("localPackage appVersion: " + localPackage.appVersion);
        console.log("localPackage description: " + localPackage.description);
        console.log("localPackage failedInstall: " + localPackage.failedInstall);
        console.log("localPackage isFirstRun: " + localPackage.isFirstRun);
        console.log("localPackage isMandatory: " + localPackage.isMandatory);
        console.log("localPackage packageSize: " + localPackage.packageSize);

        //앱버전 저장하여 앱 상단 오른쪽에 보여주기
        let token = {
              appVersion: localPackage.appVersion,           
            };
            
        self.$store.commit("setAppVersion", token);

        // var installCallback = function () {
        //     console.log("inside app Install succeeded");
        //     self.loading.text = "업데이트가 완료 되었습니다.";
        //     setTimeout(() => {
        //       if(self.loading) self.loading.close();
        //     }, 1000);
        //     window.codePush.notifyApplicationReady();            
        // };

        console.log("app Installing package...");           
        // self.loading.text = "다운받은 패키지를 설치중입니다....";
        localPackage.install(self.installCallback, self.getErrorHandler("Installation failed."), {installMode: InstallMode.IMMEDIATE, minimumBackgroundDuration: 120, mandatoryInstallMode: InstallMode.IMMEDIATE });
        
    },
    installCallback() {
      self = this;
      console.log("installCallback : app Install succeeded");
      self.loading.text = "업데이트가 완료 되었습니다.";
      //모바일 차트 잔상제거
      if (typeof cordova !== 'undefined') {
        ChartManager.destroyAll();
      }
      setTimeout(() => {
        if(self.loading) self.loading.close();
        self.$EventBus.$emit('upChart');
      }, 1500);
      window.codePush.notifyApplicationReady();            
    },
    // Returns an error handler that logs the error to the console and displays a notification containing the error message.
    getErrorHandler (message) {
        // Displays a dialog containing a message.    
        self = this;    
        return function (error) {            
            console.log(message + ":" + error.message);
            self.$EventBus.$emit('downChart');
            // displayErrorMessage(message + ":" + error.message);
            if(self.loading) self.loading.close();

            Vue.prototype
              .$confirm(message, "", {
                confirmButtonText: "Error",
                cancelButtonText: "OK"
              })
              .then(() => {
                self.$EventBus.$emit('upChart');
              })
              .catch(() => {});
        }
    },
// --------------------------------------------------------------- */
    finalMaster() {
      const self = this;
      if (self.isMaster) {
        self.$EventBus.$emit('loadMaster');
      }
    },
    callM1321() {
      const self = this;
      self.$store.dispatch("m1321").then(obj => {
        console.log("callM1321", self.$util.getErrMsg(obj.errMsg));
        self.finalMaster();
      }).catch(err => {
        if (err) {
          console.error("callM1321", self.$util.getErrMsg(err.errMsg));
        }
      });
    },
    callM1322() {
      const self = this;
      self.$store.dispatch("m1322").then(obj => {
        console.log("callM1322", self.$util.getErrMsg(obj.errMsg));
        self.finalMaster();
      }).catch(err => {
        if (err) {
          console.error("callM1322", self.$util.getErrMsg(err.errMsg));
        }
      });
    },
    getMasterInfo() {
      const self = this;
      if (self.isMaster == false) {
        self.callM1321();
        self.callM1322();
      }
    }
  },
  created() {

  },
  beforeMount() {
    const self = this;
    //codepush
    console.log('codepush beforeMount === ');
  },
  mounted() {
    const self = this;
    window.document.addEventListener('deviceready', ()=> {
      console.log('mounted deviceready');
      
      // setTimeout(() => {
      //   if (typeof window.codePush !== 'undefined') {
      //     console.log('codepush codePushCheck' + window.codePush);
      //     window.codePush.notifyApplicationReady();
      //     self.codePushCheck();
      //   }
      // }, 1000);
      if (typeof window.codePush !== 'undefined') {
        //앱 화면 재로드시 모바일 차트 초기화
        if (typeof cordova !== 'undefined') {
          ChartManager.destroyAll();
        }
        window.codePush.notifyApplicationReady();
        // self.codePushCheck();
      }
      
      if (typeof window.cordova !== 'undefined') {
        window.cordova.exec(null,null,"AppPlugin","hidePatchView",null);            
      }

      // setTimeout(() => {
      console.log('window.codePush:'+window.codePush);
      if (typeof window.codePush !== 'undefined') {
        console.log('mounted codePushCheck');
        self.codePushCheck();
      }
      // }, 1500);
    })

    if (self.isSocketConnected) {
      self.getMasterInfo();
    }
    self.$EventBus.$on('socketConnected', self.getMasterInfo);
  },
  beforeDestroy() {
    const self = this;
    self.$EventBus.$off('socketConnected', self.getMasterInfo);
  }
}
</script>
