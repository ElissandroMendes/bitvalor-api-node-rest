const _ = require('lodash')

const ErrorHandler = require('./ErrorHandler')

const defaultParams = ['book','exchange', 'price', 'volume']
const operators = ['$between']

const MAX_VALUE = 999999999
const MIN_VALUE = -999999999

const names = {
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

const paramsAreInList = (paramsNames, defaultParams) =>
  paramsNames.filter(pname => defaultParams.indexOf(pname) === -1)

const check = filters => {
  return Promise.resolve(filters)
    .then(filters => {
      const paramsNames = paramsAreInList(Object.keys(filters), defaultParams)

      if (paramsNames.length > 0)
        ErrorHandler.getError('paramsNotDefault', null, paramsNames)

      if(filters.exchange
        && !names[filters.exchange]
        && !filters.exchange.match(/[a-z0-9]/gi
          && !filters.exchange.match(names.initials)))
        ErrorHandler.getError('paramsNotDefault', null, ' exchange')

      if (filters.price) {
        filters.price.$between = JSON.parse(filters.price.$between)
        if (!Array.isArray(filters.price.$between)) ErrorHandler.getError('paramsNotDefault', null, ' price')
      }
      if (filters.volume) {
        filters.volume.$between = JSON.parse(filters.volume.$between)
        if (!Array.isArray(filters.volume.$between)) ErrorHandler.getError('paramsNotDefault', null, ' volume')
      }

      return filters
    })
}

module.exports = {
  check: check,
  filter: (filters, data) => {
    return Promise
      .resolve([filters, data])
      .then(params => params[1])
      .catch(console.log)
  }

}
