const ParamsHandler = require('../../../../utils/ParamsHandler')

module.exports = {
  onFind: hook => {
    return Promise.resolve(hook)
      .then(hook => ParamsHandler.check(hook.params.query))
      .then(filters => {
        if (filters.book) {
          hook.params.query = Object.assign(hook.params.query,
            {$select: {createdAt: 1, cached: 1, [filters.book]:  1}})
          hook.params.filters = Object.assign({}, {book:filters.book})
          delete hook.params.query.book
        }
        if (filters.exchange) {
          hook.params.filters = Object.assign(hook.params.filters || {}, {exchange:filters.exchange})
          delete hook.params.query.exchange
        }

        if (filters.price) {
          hook.params.filters = Object.assign(hook.params.filters || {}, {price:filters.price})
          delete hook.params.query.price
        }

        if (filters.volume) {
          hook.params.filters = Object.assign(hook.params.filters || {}, {volume:filters.volume})
          delete hook.params.query.volume
        }

        hook.params.query = Object.assign(hook.params.query, {$limit: 1, $sort: {createdAt: -1}})
        return hook
      })
  }
}
