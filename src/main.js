// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

if (process.env.BUILD_ENV == 'real') {
  window['console']['log'] = function() {};
}

import 'es6-promise/auto'

import Vue from 'vue'
import VueCookies from 'vue-cookies'
import App from './App'
import router from './router/index'
import i18n from "./lang/index";
import store from "./vuex/store";
import VueYouTubeEmbed from "vue-youtube-embed";
import ElementUI from 'element-ui';

/** Vue Material */
import VWave from 'v-wave';
import { MdButton, MdContent, MdTabs } from 'vue-material/dist/components';
import 'vue-material/dist/vue-material.min.css';
import './styles/material-theme.scss';

import 'chart.js';
import 'chartjs-gauge';
import 'vue-chartjs';

import VueNativeSock from "./plugin/socketManager/SocketManager";
import Util from "./plugin/util";
import './plugin/filters';


import Router from 'vue-router'
const originalPush = Router.prototype.push;
console.log(originalPush);
Router.prototype.push = function push(location, onResolve, onReject) {
  return originalPush.call(this, location).catch(err => err);
}

import { sendApi } from '@/api';

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
});

/** Vue Material */
Vue.use(MdButton);
Vue.use(MdContent);
Vue.use(MdTabs);

Vue.use(VWave, {
  color: '#1453AF',
  startingOpacity: 0.5,
  easing: 'ease-in',
});

Vue.use(VueNativeSock, process.env.BASE_API, {
  store: store
});

Vue.use(Util);

Vue.use(VueYouTubeEmbed);

Vue.use(VueCookies);

Vue.prototype.$EventBus = new Vue();

let langType = localStorage.getItem("SIGNALMAKER_langType");
i18n.locale = langType=='en'?'en':'ko';

router.beforeEach((to, from, next) => {
  new Promise(function () {
    sendApi('/session', null, (res) => {
      console.log("session", res);
      store.commit("SET_USERINFO", res);   //세션 저장
      // 경로가 root인 경우 리다이렉트
      if (to.path === '/') {
        if (res) {
          next('/home/interest');
        } else {
          next('/home/taste');
        }
      } else {
        next();
      }
    });
  });
});

if (process.env.BUILD_ENV == 'dev') {
  document.title = 'Staging SiON App';
}

//공백 제거
String.prototype.rtrim = function() { return this.replace(/\s+$/,""); }

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
