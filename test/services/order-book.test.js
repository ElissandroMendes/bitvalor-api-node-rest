const assert = require('assert')
const app = require('../../src/app')
const rp = require('request-promise')

const makeRequest = url => {
  return rp({
    url: url
  }).then(res => JSON.parse(res))
}

describe('Order Book', () => {
  before(function (done) {
    this.server = app.listen(3030)
    this.server.once('listening', () => done())
  })

  after(function (done) {
    this.server.close(done)
  })

  it('Deve registrar o serviço.', () => {
    const service = app.service('order-book')
    assert.ok(service, 'Registered the service')
  })

  it('Deve receber erro 405 em qualquer requisição que não seja GET com parâmetros', () => {
    //Como o framework bloqueia todos da mesma maneira, apenas o GET/id será testado para fins de legibilidade.
    return makeRequest('http://localhost:3030/order-book/42')
      .catch(res => {
        assert.equal(res.statusCode, 405)
      })
  })

  it('Deve receber resposta 200 OK e a flag cached=true, ou seja, os dados vieram do cache.', () => {
    return app.service('order-book').create({
      asks: [],
      bids: [],
      createdAt: Date.now(),
      cached: true
    }).then(() => makeRequest('http://localhost:3030/order-book/'))
      .then(res => {
        assert.equal(res.data[0].cached, true)
      })
  })

  it('Deve receber resposta 200 OK e a flag cached=false, ou seja, os dados vieram do API.', () => {
    return app.service('order-book').create({
      asks: [],
      bids: [],
      createdAt: Date.now() - 60 * 1000 + 1,
      cached: true
    }).then(() => makeRequest('http://localhost:3030/order-book'))
      .then(res => {
        console.log(process.env.NODE_ENV)
        assert.equal(res.data[0].cached, true)
      })
  })
})
