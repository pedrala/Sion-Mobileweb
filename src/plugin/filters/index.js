import Vue from 'vue'
import moment from 'moment'
import store from '@/vuex/store'

//MariaDB로부터 얻어온 날짜형식(YYYY-MM-DDTHH:mm:ssZ)
Vue.filter("dateFormat", val => {
  if (val && val != '') {
    if (val == '-') {
      return val;
    } else {
      return moment(val, 'YYYY-MM-DDTHH:mm:ssZ').format('YYYY.MM.DD HH:mm:ss');
    }
  } else {
    return '';
  }
});

Vue.filter("dateFormat1", val => {
  if (val && val != '') {
    if (val == '-') {
      return val;
    } else {
      return moment(val, 'YYYY-MM-DDTHH:mm:ssZ').format('YYYY.MM.DD');
    }
  } else {
    return '';
  }
});

//AP로부터 얻어온 날짜형식(YYYYMMDDHHmmss)
Vue.filter("dateFormat2", val => {
  if (val && val != '') {
    if (val == '-') {
      return val;
    } else {
      return moment(val, 'YYYYMMDDHHmmss').format('YYYY.MM.DD HH:mm:ss');
    }
  } else {
    return '';
  }
});

//AP로부터 얻어온 날짜형식(YYYYMMDD)
Vue.filter("dateFormat3", val => {
  if (val && val != '') {
    if (val == '-') {
      return val;
    } else {
      return moment(val, 'YYYYMMDD').format('YYYY.MM.DD');
    }
  } else {
    return '';
  }
});

Vue.filter("dateFormat4", val => {
  if (val && val != '') {
    if (val == '-') {
      return val;
    } else {
      return moment(val, 'YYYYMMDDHHmmss').format('MM.DD HH:mm');
    }
  } else {
    return '';
  }
});

Vue.filter("dateFormat5", val => {
  if (val && val != '') {
    if (val == '-') {
      return val;
    } else {
      return moment(val, 'YYYYMMDD').format('YYYY.MM.DD') +' ' + moment(val, 'YYYYMMDDHH').format('HH')+'시 기준';
    }
  } else {
    return '';
  }
});
Vue.filter("dateFormat6", val => {
  if (val && val != '') {
    if (val == '-') {
      return val;
    } else {
      return moment(val, 'YYYYMMDDHHmmss').format('YY.MM.DD');
    }
  } else {
    return '';
  }
});
//HTML 태그 제거
Vue.filter("removeTags", val => {
  if (val && val != '') {
    return val.replace(/<[^>]*>/g, ' ')
          .replace(/\s{2,}/g, ' ')
          .trim();
  } else {
    return '';
  }
});

//숫자형식 변경
Vue.filter("numberFormat", val => {
  if (val && val != '') {
    if (val == '-') {
      return val;
    } else {
      // val = Number(val);
      val = val.toString();
      var strArr = val.split('.');
      var num = strArr[0]?strArr[0]:'';
      var dec = strArr[1]?strArr[1]:'';
      num = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
      return num;
    
    }
  } else {
    return '';
  }
});

//숫자형식 변경 (소수점 이하 모든 자리수 표현)
Vue.filter("numberFormat2", val => {
  if (val && val != '') {
    if (val == '-') {
      return val;
    } else {
      if (typeof val == 'number') {
        val = val.toString();
      }
      var strArr = val.split('.');
      var num = strArr[0]?strArr[0]:'';
      var dec = strArr[1]?strArr[1]:'';
      num = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      if (dec) {
        return num + "." + dec;
      } else {
        return num;
      }
    }
  } else {
    return '';
  }
});


//소수점 2자리 표현
Vue.filter("numberFormat3", val => {
  if (val && val != '') {
    if (val == '-') {
      return val;
    } else {
      val = val.toString();
      var strArr = val.split('.');
      var num = strArr[0]?strArr[0]:'';
      if (parseInt(num) > 0) {
        num = '+' + num;
      }
      var dec = strArr[1]?strArr[1]:'';
      num = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      if (dec) {
        return num + "." + dec;
      } else {
        return num;
      }
    }
  } else {
    return '';
  }
});

//숫자형식 변경 (시가총액, 거래량 등 Trilion > Billion > Million 순으로 단위 처리)
Vue.filter("numberFormat4", val => {
  if (val && val != '') {
    if (val == '-') {
      return val;
    } else {
      val = Number(val);
      val = val.toString();
      var strArr = val.split('.');
      var num = strArr[0]?strArr[0]:'';
      var dec = strArr[1]?strArr[1]:'';
      var num2 = num/1000000000000 //Trilion 단위 처리 (1조)
      var num3 = num/1000000000 //Billion 단위 처리 (10억)
      var num4 = num/1000000 //Million 단위 처리 (100만)
      num = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      if(num2 > 1)
      {
        return num2.toFixed(2) + 'T';
      }
      else if(num3 > 1)
      {         
        return num3.toFixed(2) + 'B';
      }   
      else if(num4 > 1)
      {         
        return num4.toFixed(2) + 'M';
      }   
      else{
        return num
      } 
     
    }
  } else {
    return '0';
  }
});


// 이름 마스킹
Vue.filter("nameFormat", val => {
  if (val && val != '') {
    let len = val.length;
    let pattern = new RegExp('.(?=.{0,' + len + '})', 'g');
    let tmp = val.replace(pattern, "*");
    if (len > 2) {
      val = val.substring(0, 1) + tmp.substring(1, len-1) + val.substring(len-1, len);
    } else if (len == 2) {
      val = val.substring(0, 1) + tmp.substring(1, len);
    } else {
      val = tmp;
    }
    return val;
  } else {
    return '';
  }
});

// 계좌번호 마스킹
Vue.filter("accountFormat", val => {
  if (val && val != '') {
    let len = val.length;
    let pattern = new RegExp('.(?=.{0,' + len + '})', 'g');
    let tmp = val.replace(pattern, "*");
    if (len > 6) {
      val = val.substring(0, 3) + tmp.substring(3, len-3) + val.substring(len-3, len);
    } else if (len > 4) {
      val = val.substring(0, 2) + tmp.substring(2, len-2) + val.substring(len-2, len);
    } else {
      val = tmp;
    }
    return val;
  } else {
    return '';
  }
});

/**
* @filter html Tag 제거 Filter
* */
Vue.filter("removeTag", val => {
  if (val && val != '') {
    return val.replace(/<[^>]*>/g, '');
  } else {
    return '';
  }
});

//거래소명 가져오기
Vue.filter("exchangeName", val => {
  const exchanges = store.getters.exchanges;
  let tmp = exchanges.filter(item => item.vexid == val);
  return tmp.length>0?tmp[0].vexidnm:'';
});

