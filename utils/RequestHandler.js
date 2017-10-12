const Axios = require('axios')

const baseURL = 'https://api.bitvalor.com/v1/'

const configs = {
  responseType: 'json',
  baseURL
}

const makeRequest = params => Axios(Object.assign(params, configs)).then(res => res.data)

module.exports = {
  get: params => {
    return makeRequest(Object.assign(params, {method: 'GET'}))
  }
}
