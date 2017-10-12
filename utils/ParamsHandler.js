const _ = require('lodash')

const ErrorHandler = require('./ErrorHandler')

const defaultParams = ['exchange', 'name', 'price', 'volume']

const validParams = {
  orderType: 'bidsasks',
  name: {
    'Arena Bitcoin': 'ARN',
    'BitcoinToYou': 'B2U',
    'Basebit': 'BAS',
    'Bitinvest': 'BIV',
    'Bitsquare': 'BSQ',
    'flowBTC': 'FLW',
    'FoxBit': 'FOX',
    'LocalBitcoins': 'LOC',
    'Mercado Bitcoin': 'MBT',
    'Negocie Coins': 'NEG',
    'Paxful': 'PAX'
  },
  initials: 'ARNB2UBASBIVBSQFLWFOXLOCMBTNEGPAX'
}

const checkParams = params => {
  return Promise.resolve(params)
    .then(params => {
      if (!params) return params

      const paramsNames = Object.keys(params)
      if (_.intersection(defaultParams, paramsNames).length < paramsNames.length)
        ErrorHandler.throwError('paramsNotDefault', _.difference(defaultParams, paramsNames))

      return params


    })
}

const query = (data, params) => {

}

module.exports = {
  filter: params =>
    Promise
      .resolve(checkParams)
      .catch(err => {
        throw new FeathersErrors.errors.BadRequest(`Requisição inválida: ${err || err.message}`)
      })
}
