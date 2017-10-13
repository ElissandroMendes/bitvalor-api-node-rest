module.exports = {
  onFind: hook => {

    if (hook.params.query.exchange) {
      hook.params.query = Object.assign(hook.params.query,
        {$select: {createdAt: 1, cached: 1, [hook.params.query.exchange]: 1}})

      delete hook.params.query.exchange
    }

    let filters = {}

    if (hook.params.query.name) {
      filters = Object.assign(filters, {name: hook.params.query.name})
      delete hook.params.query.name
    }

    if (hook.params.query.price) {
      filters = Object.assign(filters, {price: hook.params.query.price})
      delete hook.params.query.price
    }
    if (hook.params.query.volume) {
      filters = Object.assign(filters, {volume: hook.params.query.volume})
      delete hook.params.query.volume
    }

    hook.params.filters = filters
    hook.params.query = Object.assign(hook.params.query, {$limit: 1, $sort: {createdAt: -1}})

    return Promise.resolve(hook)
  }
}
