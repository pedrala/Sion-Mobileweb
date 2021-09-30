var BASE_API = ''
var CERT_URL = ''
var SOURCE_MAP = false
var IMG_URL = ''
var EXCN_URL = ''
var DOMAIN = ''

var BUILD_ENV = ''
var NODE_ENV = '"production"'

if (process.argv[2] === 'dev') {
  SOURCE_MAP = true

  BASE_API = '"https://dev.signalmakeron.com:4793"'
  CERT_URL = '"https://dev.signalmakeron.com/kmcis/kmcis_sion_seed.php"'
  IMG_URL = '"https://dev.signalmakeron.com/img"'
  EXCN_URL =  '"https://dev.2xchange.co.kr:9443/ASP/api/bank/EX0110"'
  DOMAIN = '"dev.signalmakeron.com"'
  BUILD_ENV = '"dev"'
}
//  else if (process.argv[2] === 'real') {
//   BASE_API = '"https://www.signalmakeron.com:4791"'
//   CERT_URL = '"https://www.signalmakeron.com/kmcis/kmcis_sion_seed.php"'
//   IMG_URL = '"https://www.signalmakeron.com/img"'
//   EXCN_URL =  '"https://www.2xchange.co.kr:9443/ASP/api/bank/EX0110"'
//   DOMAIN = '"www.signalmakeron.com"'
// }

module.exports = {
  NODE_ENV, BASE_API, CERT_URL, IMG_URL, SOURCE_MAP, EXCN_URL, DOMAIN, BUILD_ENV
}
