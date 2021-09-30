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
  baseURL: process.env.IMG_URL,
  withCredentials: true,
  timeout: 5000
});

export function uploadFile(url, params, callback) {
  service.post(url, params, { headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => {
    if (callback) callback(res);
  }).catch(error => {
    console.error(error);
    if (callback) callback();
  });
}
