// Initializes the `order-book` service on path `/order-book`
const createService = require('feathers-nedb')
const createModel = require('../../models/order-book.model')
const hooks = require('./order-book.hooks')
const filters = require('./order-book.filters')

module.exports = function () {
  const app = this
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    name: 'order-book',
    Model,
    paginate
  }

  // Initialize our service with any options it requires
  app.use('/order-book', createService(options))

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('order-book')

  service.hooks(hooks)

  if (service.filter) {
    service.filter(filters)
  }
}
