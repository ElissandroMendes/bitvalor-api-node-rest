const ErrorHandler = require('./ErrorHandler')

const MAX_VALUE = 999999999
const MIN_VALUE = -999999999

const validations = {
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
  initials: 'arnb2ubasbivbsqflwfoxlocmbtnegpax',
  books: 'asksbids'
}

const checkBetween = (filter, filterName) => {
  filter.$between = filter.$between
    ? JSON.parse(filter.$between)
    : [MIN_VALUE, MAX_VALUE]

  if (filter.$between[0] === 'null' || filter.$between[0] === null || filter.$between[0] < MIN_VALUE)
    filter.$between[0] = MIN_VALUE

  if (filter.$between[1] === 'null' || filter.$between[1] === null || filter.$between[1] < MAX_VALUE)
    filter.$between[1] = MAX_VALUE

  if (!Array.isArray(filter.$between))
    ErrorHandler.getError('paramsNotDefault', null, ` ${filterName}`)

  return filter
}

const validateExchangeName = exchange => {
  exchange = exchange.toLowerCase()
  let validName = validations.name[exchange]
  let matchRegex = exchange.match(/[a-z0-9_]/gi)
  let matchInitials = validations.initials.match(exchange)

  if (matchRegex && validName || matchInitials)
    return exchange

  ErrorHandler.getError('paramsNotDefault', null, ' exchange')
}

const validateBook = book => {
  book = book.toLowerCase()
  if (!validations.books.match(book)) ErrorHandler.getError('paramsNotDefault', null, ' book')
  return book
}

module.exports = { validateBook, validateExchangeName, checkBetween }
