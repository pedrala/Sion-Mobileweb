import QueryManager from './QueryManager'

export default class {
  constructor(connectionUrl, opts = {}) {
    this.connectionUrl = connectionUrl;
    this.pollingTimer = null;
    if (opts.store) {
      this.store = opts.store;
    }
    this.connect();
  }

  connect() {
    if (!this.queryManager) {
      this.queryManager = new QueryManager();
      this.queryManager.setConnectCallback(this.onConnectedServer.bind(this));
      this.queryManager.setClosedCallback(this.onClosedServer.bind(this));
    }
    this.queryManager.startManager(this.connectionUrl);
  }

  onConnectedServer() {
    console.log('Observer.onConnectedServer');
    this.queryManager.clearAllRealCallbacks(); // 콜백 모두 제거 (unregisterReal가 동작하더라도 서버에 전송되지는 못함)

    if (this.store) {
      this.passToStore('SOCKET_ONOPEN', true); // VUE 이벤트 발생
    }

    console.log("Polling Start");
    var self = this;
    this.pollingTimer = setInterval(function() {
      if (self.queryManager) {
        self.queryManager.pollingProcess();
      }
    }, 30000);
  }

  onClosedServer() {
    console.log('Observer.onClosedServer');
    if (this.store) {
      this.passToStore('SOCKET_ONCLOSE', false);
    }

    console.log("Polling End");
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
      this.pollingTimer = null;
    }

    console.log("reconnect");
    this.connect();
  }
  
  passToStore(eventName, event) {
    this.defaultPassToStore(eventName, event)
  }

  defaultPassToStore(eventName, event) {
    let method = 'commit'
    let target = eventName.toUpperCase()
    let msg = event
    if (this.format === 'json' && event.data) {
      msg = JSON.parse(event.data)
      if (msg.mutation) {
        target = [msg.namespace || '', msg.mutation].filter((e) => !!e).join('/')
      } else if (msg.action) {
        method = 'dispatch'
        target = [msg.namespace || '', msg.action].filter((e) => !!e).join('/')
      }
    }
    if (this.mutations) {
      target = this.mutations[target] || target
    }
    this.store[method](target, msg)
  }
}
