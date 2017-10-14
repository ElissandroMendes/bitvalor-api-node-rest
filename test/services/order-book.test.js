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

  describe('Order book # endpoint', ()=> {
    it('Deve receber erro 405 em qualquer requisição que não seja GET com parâmetros', () => {
      //Como o framework bloqueia todos da mesma maneira, apenas o GET/id será testado para fins de legibilidade.
      return makeRequest('http://localhost:3030/order-book/42')
        .catch(res => {
          assert.equal(res.statusCode, 405)
        })
    })

    it('Deve receber resposta 200 OK e a flag cached=true, ou seja, os dados vieram do cache.', () => {
      return app.service('order-book').create({
        asks: [1],
        bids: [1],
        createdAt: Date.now(),
        cached: true
      }).then(() => makeRequest('http://localhost:3030/order-book/'))
        .then(res => {
          assert.equal(res.data[0].cached, true)
        })
    })

    it('Deve receber resposta 200 OK e a flag cached=false, ou seja, os dados vieram do API.', () => {
      return app.service('order-book').create({
        asks: [1],
        bids: [1],
        createdAt: Date.now() - 60001,
        cached: true
      }).then(() => makeRequest('http://localhost:3030/order-book'))
        .then(res => {
          assert.equal(res.data[0].cached, true)
        })
    })
  })
  describe('Order book # filters', ()=>{

    it('Deve retornar Bad Request se existir algum parâmetro que não seja: book,exchange,price e volume.',()=>{
      return makeRequest('http://localhost:3030/order-book?bookabc=bids')
        .catch(res => {
          assert.equal(res.statusCode,400)
        })
    })

    describe('Order book # filters => book', ()=>{
      it('Deve receber a lista de bids sem filtro ao passar o parâmetro book=bids.',()=>{
        return makeRequest('http://localhost:3030/order-book?book=bids')
          .then(res => {
            assert.equal(res.data.length > 0, true)
            assert.equal(res.data[0].bids.length > 0, true)
            assert.equal(res.data[0].asks === undefined, true)
          })
      })

      it('Deve receber a lista de asks sem filtro ao passar o parâmetro book=asks.',()=>{
        return makeRequest('http://localhost:3030/order-book?book=asks')
          .then(res => {
            assert.equal(res.data.length > 0, true)
            assert.equal(res.data[0].asks.length > 0, true)
            assert.equal(res.data[0].bids === undefined, true)
          })
      })
    })

    describe('Order book # filters => exchange', ()=>{
      it('Deve retornar Bad Request se a sigla da exchange pedida não existir na documentação da API.',()=>{
        return makeRequest('http://localhost:3030/order-book?exchange=abc')
          .catch(res => {
            assert.equal(res.statusCode,400)
          })
      })

      it('Deve retornar Bad Request se o nome da exchange pedida não existir na documentação da API.',()=>{
        return makeRequest('http://localhost:3030/order-book?exchange=bitcoinforyou')
          .catch(res => {
            assert.equal(res.statusCode,400)
          })
      })

      it('Deve retornar Bad Request se a exchange pedida possuir caracteres não alfanuméricos (exceto _)',()=>{
        return makeRequest('http://localhost:3030/order-book?exchange=abc*')
          .catch(res => {
            assert.equal(res.statusCode,400)
          })
      })
    })
  })
})


