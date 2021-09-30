// store.js
import Vue from "vue";
import Vuex from "vuex";

import exchange from "./modules/exchange";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    exchange
  },
  state: {
    isDrop: false,  // 회원탈퇴시 사용
    needLogin: false,
    loginCallbackUrl: '',
    userInfo: null,
    socket: {
      isConnected: false,
      reconnectError: false
    },
    bbsInfo: null,
    appVersion: '',
    isVertical: true,
  },
  getters: {
    getUserInfo(state) {
      return state.userInfo;
    },
    isSocketConnected(state) {
      return state.socket.isConnected;
    },
    getBbsInfo(state) {
      return state.bbsInfo;
    },
    isLoggedIn(state) {
      return !!state.userInfo;
    },
    getNeedLogin(state) {
      return state.needLogin;
    },
    getLoginCallbackUrl(state) {
      return state.loginCallbackUrl;
    },
    getIsDrop(state) {
      return state.isDrop;
    },
    getAppVersion(state){
      return state.appVersion;
    },
    isVertical(state) {
      return state.isVertical;
    },
  },
  mutations: {
    SOCKET_ONOPEN(state, event) {
      state.socket.isConnected = event;
      if (state.socket.isConnected) {
        console.log("SOCKET_ONOPEN");
      } else {
        console.log("SOCKET_ONCLOSE");
      }
    },
    SOCKET_ONCLOSE(state, event) {
      state.socket.isConnected = event;
      if (state.socket.isConnected) {
        console.log("SOCKET_ONOPEN");
      } else {
        console.log("SOCKET_ONCLOSE");
      }
    },
    SET_USERINFO(state, token) {
      state.userInfo = token;
    },
    setBbsInfo(state, token) {
      state.bbsInfo = token;
    },
    setNeedLogin(state, token) {
      state.needLogin = token;
    },
    setLoginCallbackUrl(state, token) {
      state.loginCallbackUrl = token;
    },
    setIsDrop(state, isDrop) {   
      state.isDrop = isDrop;
    },
    setAppVersion(state, token) {   
      state.appVersion = token;
    },
    setVertical(state, bool) {
      state.isVertical = bool;
    },
  },
  actions: {
    
  }
});

export default store