const _ = require('lodash')

const ErrorHandler = require('./ErrorHandler')

const defaultParams = ['name','price', 'volume']
const operators = ['$between']

const MAX_VALUE = 999999999
const MIN_VALUE = -999999999

const validParams = {
  name: {
    'arena_bitcoin': 'arn',
    'bitcointoyou': 'b2u',
    'basebit': 'bas',
    'bitinvest': 'biv',
    'bitsquare': 'bsq',
    'flowbtc': 'flw',
    'foxbit': 'fox',
    'localbitcoins': 'loc',
    'mercado_bitcoin': 'mbt',
    'negocie_coins': 'neg',
    'paxful': 'pax'
  },
  initials: 'arnb2ubasbivbsqflwfoxlocmbtnegpax'
}

const checkParams = params => {
  const filters = params[0]
  const data = params[1]

  return Promise.resolve(filters)
    .then(filters => {
      const paramsNames = Object.keys(filters)
      if (_.intersection(defaultParams, paramsNames).length < paramsNames.length)
        return ErrorHandler.throwError('paramsNotDefault', _.difference(defaultParams, paramsNames))

      if(filters.name && typeof filters.name !== "string")
        return ErrorHandler.throwError('paramsNotDefault', ' name')

      if(filters.price){
        filters.price.$between = JSON.parse(filters.price.$between)
        if(!Array.isArray(filters.price.$between)) return ErrorHandler.throwError('paramsNotDefault', ' price')
      }

      if(filters.volume){
        filters.volume.$between = JSON.parse(filters.volume.$between)
        if(!Array.isArray(filters.volume.$between)) return ErrorHandler.throwError('paramsNotDefault', ' volume')
      }

      return [filters,data]
    }).then(params => {
      return params[1]
    })

 /* return Promise.resolve(params)
    .then(params => {
      if (!params) return params

      const paramsNames = Object.keys(params)
      if (_.intersection(defaultParams, paramsNames).length < paramsNames.length)
        ErrorHandler.throwError('paramsNotDefault', _.difference(defaultParams, paramsNames))

      return params


    })*/
}

const query = (data, params) => {

}

module.exports = {
  filter: (filters, data) => {
    return Promise
      .resolve([filters,data])
      .then(checkParams)
      .catch(console.log)
  }

}
