const ParamsHandler = require('../../../../utils/ParamsHandler')

module.exports = {
  onFind: hook => {
    return Promise.resolve(hook)
      .then(hook => ParamsHandler.check(hook.params.query))
      .then(filters => {
        if (hook.params.query.book) {
          hook.params.query = Object.assign(hook.params.query,
            {$select: {createdAt: 1, cached: 1, [hook.params.query.book]: 1}})
          delete hook.params.query.book
        }
        if (filters.exchange) delete hook.params.query.exchange
        if (filters.price) delete hook.params.query.price
        if (filters.volume) delete hook.params.query.volume

        hook.params.filters = filters
        hook.params.query = Object.assign(hook.params.query, {$limit: 1, $sort: {createdAt: -1}})
        return hook
      })
  }
}
