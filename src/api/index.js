import axios from 'axios'

axios.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  return Promise.reject(error);
});

const service = axios.create({
  baseURL: process.env.BASE_API,
  withCredentials: true,
  timeout: 10000
});

export function sendApi(url, params, callback) {
  console.log("sendApi", url, params);
  service.post(url, params).then(res => {
    if (callback) callback(res.data);
  }).catch(error => {
    console.error(error);
    if (callback) callback();
  });
}
