'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',

  //BASE_API: '"http://localhost:4791"',     //local
  BASE_API: '"https://dev.signalmakeron.com:4793"', //dev
  CERT_URL: '"https://dev.signalmakeron.com/kmcis/kmcis_sion_seed.php"',
  IMG_URL: '"https://dev.signalmakeron.com/img"',
  EXCN_URL: '"https://dev.2xchange.co.kr:9443/ASP/api/bank/EX0110"',
  DOMAIN: '"dev.signalmakeron.com"',
  BUILD_ENV: '"dev"'
})
