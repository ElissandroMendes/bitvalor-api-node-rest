module.exports = {
  onFind: hook => {

    if(hook.params.query.exchange)
      hook.params.query = Object.assign(hook.params.query,
        {$select: {createdAt: 1, cached: 1, [hook.params.query.exchange]: 1}})

    hook.params = Object.assign(hook.params,
      {query: {$limit: 1, $sort: {createdAt: -1}}})
    return Promise.resolve(hook)
  }
}
