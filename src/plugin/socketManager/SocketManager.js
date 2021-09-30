import Observer from './Observer'

export default {
  install (Vue, connectionUrl, opts = {}) {
    if (!connectionUrl) { 
      throw new Error('[vue-native-socket] cannot locate connection');
    }

    let observer = new Observer(connectionUrl, opts);
    Vue.prototype.$socket = observer.queryManager;
  }
}
