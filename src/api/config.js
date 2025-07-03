import axios from 'axios';
axios.defaults.baseURL = process.env.API_URL || 'http://localhost:8080/api/v1';
axios.defaults.timeout = 10000;
axios.defaults.headers.post['Accept'] = 'application/json'

axios.interceptors.request.use(config => {
  const authen = localStorage.getItem('user', {})
  const token = authen ? JSON.parse(authen).access_token : '';
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  // Do something with request error
  console.error('Request error:', error)
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  return response.data
}, error => {
  // const token = localStorage.getItem('authen')
  // let response = error.response
  // if (response.status === 400 || response.status === 401) {
  //   if (!(response.config.method === 'post' && response.config.url === response.config.baseURL + '/accounts/login')) {
  //     if (token) {
  //       localStorage.removeItem('authen')
  //     }
  //     router.push('/accounts/login')
  //   }
  // }
  // if (response.status === 403) {
  //   router.push({name: 'permission-denied'})
  // }
  // console.error('Response error:', error, error.message)
  return error.response.data
})