const assert = require('assert')
const app = require('../../src/app')
const rp = require('request-promise')

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
    return rp({
      url: 'http://localhost:3030/order-book/42',
      headers: {
        'Accept': 'text/html'
      }
    }).catch(res => {
      assert.equal(res.statusCode, 405)
    })
  })
})
