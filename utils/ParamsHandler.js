const Promise = require('bluebird')

const ErrorHandler = require('./ErrorHandler')
const ValidationHandler = require('./ValidationHandler')

const paramsAreInList = (paramsNames) =>
  paramsNames.filter(pname =>['book', 'exchange', 'price', 'volume'].indexOf(pname) === -1)

const check = filters => {
  return Promise.resolve(filters)
    .then(filters => {
      const paramsNames = paramsAreInList(Object.keys(filters))

      if (paramsNames.length > 0)
        ErrorHandler.getError('paramsNotDefault', null, paramsNames)

      if (filters.book) filters.book = ValidationHandler.validateBook(filters.book)
      if (filters.exchange) filters.exchange = ValidationHandler.validateExchangeName(filters.exchange)
      if (filters.price) filters.price = ValidationHandler.checkBetween(filters.price, 'price')
      if (filters.volume) filters.volume = ValidationHandler.checkBetween(filters.volume, 'volume')

      return filters
    }).catch(err => {
      ErrorHandler.getError(null, null, `${err || err.message}`)
    })
}

const filter = (data, filters) => {
  return Promise.resolve(data)
    .then(data => filters.exchange
        ? data.filter(d => d[0].toLowerCase() === filters.exchange)
        : data
    )
    .then(filtered1 => {
      return filters.price
        ? filtered1.filter(d => d[1] >= filters.price.$between[0] && d[1] <= filters.price.$between[1])
        : filtered1
    })
    .then(filtered2 => {
      return filters.volume
        ? filtered2.filter(d => d[2] >= filters.volume.$between[0] && d[2] <= filters.volume.$between[1])
        : filtered2
    })
    .then(done => {
      return done
    })

}

module.exports = {
  check: check,
  filter: (filters, result) => {
    let results = result.data[0]
    return Promise.resolve(filters)
      .then(filters => {
        let howMuchFilters = Object.keys(filters || {}).length
        return (howMuchFilters === 0) //Não tem filtro, retorna tudo
          ? results
          : howMuchFilters === 1 && filters.book //Filtro apenas por book, retorna apenas o array dele
            ? { [filters.book]: results[filters.book] }
            : filters.book //Filtro por book e pelo menos algum outro, filtra normalmente
              ? filter(results[filters.book], filters)
              : Promise.all([ //Filtro de ambos os books
                filter(results['asks'], filters),
                filter(results['bids'], filters)
              ])
      })
      .then(done => {
        const legacyData = {
          cached: result.data[0].cached,
          createdAt: result.data[0].createdAt,
          _id: result.data[0]._id
        }

        result.data[0] = filters && filters.book
          ? Array.isArray(done)
            ? done.length === 2
              ? Object.assign(result.data[0], { 'asks': done[0], 'bids': done[1] })
              : Object.assign(legacyData, { [filters.book]: done })
            : Object.assign(result.data[0], legacyData, { [filters.book]: done[filters.book] })
          : filters
            ? done.length === 2
              ? Object.assign(result.data[0], { 'asks': done[0], 'bids': done[1] })
              : done
            : done

        return result
      })
      .catch(console.log)
  }

}
