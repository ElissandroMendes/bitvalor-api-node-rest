const orderBook = require('./order-book/order-book.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(orderBook);
};
