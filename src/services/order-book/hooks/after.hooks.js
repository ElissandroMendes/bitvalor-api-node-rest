const url = '/order_book.json'
const MINUTES_TO_WAIT = 1

const DateHandler = require('../../../../utils/DateHandler')
const RequestHandler = require('../../../../utils/RequestHandler')

const isTimeToRequest = createdAt => DateHandler.diff(Date.now(),createdAt,'minutes') >= MINUTES_TO_WAIT

const getOrderBook = hook => {
  const OrderBook = hook.app.service('order-book')

  return RequestHandler.get({url})
    .then(response => OrderBook.create(Object.assign(response, {createdAt: Date.now(), cached: true})))
    .then(() => {
      return OrderBook.find(hook.params).then(res => {
        res.data[0].cached = false
        hook.result = res
        return hook
      })
    })
}

module.exports = {
  onFind: hook => {
    return Promise.resolve(hook)
      .then(hook => isTimeToRequest(hook.result.data.length > 0 ? hook.result.data[0].createdAt : 1))
      .then(isAllowed => {
        return isAllowed
          ? getOrderBook(hook)
          : hook
      })
  }
}
