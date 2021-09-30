const iconv = require('iconv-lite');

class Util {
  getErrMsg(errMsg) {
    if (errMsg) {
      return iconv.decode(Object.values(errMsg), 'euc-kr');
    } else {
      return "";
    }
  }
}

export default {
  install (Vue) {
    let util = new Util();
    Vue.prototype.$util = util;
  }
}
