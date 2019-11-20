import axios from 'axios'
// axios.defaults.baseURL = '/ht'
// axios request 拦截器
axios.interceptors.request.use(config => {
  return config
}, (error) => {
  return Promise.reject(error)
})

// axios response 拦截器
axios.interceptors.response.use(response => {
  return response
}, (error) => {
  return Promise.reject(error)
})

/**
  * 封装get方法
  * @param url
  * @param data
  * @returns {Promise}
  */
function dataGet (apiName, params, callback) {
  axios.get(apiName, {
    params: params
  }).then((response) => {
    // 返回所有数据
    var data = response.data.data
    if (data) {
      callback(data)
    }
  }).catch((error) => {
    console.log(error)
  })
}

function dataPost (apiName, params, callback) {
  axios.post(
    apiName,
    params
  ).then((response) => {
    var data = response.data
    if (data) {
      callback(data)
    }
  }).catch((error) => {
    console.log(error)
  })
}

export {
  dataGet,
  dataPost
}
