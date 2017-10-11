// Initializes the `order_book` service on path `/order-book`
const createService = require('./order-book.class.js')
const hooks = require('./order-book.hooks')

module.exports = function () {
  const app = this
  const paginate = app.get('paginate')

  const options = {
    name: 'order-book',
    paginate
  }

  // Initialize our service with any options it requires
  app.use('/order-book', createService(options))

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('order-book')

  service.hooks(hooks)
}
