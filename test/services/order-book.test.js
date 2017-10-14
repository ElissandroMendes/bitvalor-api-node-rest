const assert = require('assert')
const app = require('../../src/app')
const rp = require('request-promise')

const mockData = [[
                    'LOC',
                    23216.95,
                    0.047379177712835
],
                [
                    'PMX',
                    21431.03,
                    12.598554525844
                ],
                [
                    'MBT',
                    20538.07,
                    0.30436160749282
                ],
                [
                    'NEG',
                    18752.15,
                    0.079990827718422
                ],
                [
                    'LOC',
                    18599.22,
                    0.0053765695550674
                ],
                [
                    'LOC',
                    18394.97,
                    0.081544030786677
                ]
]

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

  describe('Order book # endpoint', () => {
    it('Deve receber erro 405 em qualquer requisição que não seja GET com parâmetros', () => {
      //Como o framework bloqueia todos da mesma maneira, apenas o GET/id será testado para fins de legibilidade.
      return makeRequest('http://localhost:3030/order-book/42')
        .catch(res => {
          assert.equal(res.statusCode, 405)
        })
    })

    it('Deve receber resposta 200 OK e a flag cached=true, ou seja, os dados vieram do cache.', () => {
      return app.service('order-book').create({
        asks: mockData,
        bids: mockData,
        createdAt: Date.now(),
        cached: true
      }).then(() => makeRequest('http://localhost:3030/order-book/'))
        .then(res => {
          assert.equal(res.data[0].cached, true)
        })
    })

    it('Deve receber resposta 200 OK e a flag cached=false, ou seja, os dados vieram do API.', () => {
      return app.service('order-book').create({
        asks: mockData,
        bids: mockData,
        createdAt: Date.now() - 60001,
        cached: true
      }).then(() => makeRequest('http://localhost:3030/order-book'))
        .then(res => {
          assert.equal(res.data[0].cached, true)
        })
    })
  })
  describe('Order book # filters', () => {

    it('Deve retornar Bad Request se existir algum parâmetro que não seja: book,exchange,price e volume.', () => {
      return makeRequest('http://localhost:3030/order-book?bookabc=bids')
        .catch(res => {
          assert.equal(res.statusCode, 400)
        })
    })

    describe('Order book # filters => book', () => {
      it('Deve receber a lista de bids sem filtro ao passar o parâmetro book=bids.', () => {
        return makeRequest('http://localhost:3030/order-book?book=bids')
          .then(res => {
            assert.equal(res.data.length > 0, true)
            assert.equal(res.data[0].bids.length > 0, true)
            assert.equal(res.data[0].asks === undefined, true)
          })
      })

      it('Deve receber a lista de asks sem filtro ao passar o parâmetro book=asks.', () => {
        return makeRequest('http://localhost:3030/order-book?book=asks')
          .then(res => {
            assert.equal(res.data.length > 0, true)
            assert.equal(res.data[0].asks.length > 0, true)
            assert.equal(res.data[0].bids === undefined, true)
          })
      })
    })

    describe('Order book # filters => exchange', () => {
      it('Deve retornar Bad Request se a sigla da exchange pedida não existir na documentação da API.', () => {
        return makeRequest('http://localhost:3030/order-book?exchange=abc')
          .catch(res => {
            assert.equal(res.statusCode, 400)
          })
      })

      it('Deve retornar Bad Request se o nome da exchange pedida não existir na documentação da API.', () => {
        return makeRequest('http://localhost:3030/order-book?exchange=bitcoinforyou')
          .catch(res => {
            assert.equal(res.statusCode, 400)
          })
      })

      it('Deve retornar Bad Request se a exchange pedida possuir caracteres não alfanuméricos (exceto _)', () => {
        return makeRequest('http://localhost:3030/order-book?exchange=abc*')
          .catch(res => {
            assert.equal(res.statusCode, 400)
          })
      })

      it('Deve retornar a lista filtrada por exchange=loc.', () => {
        return makeRequest('http://localhost:3030/order-book?exchange=loc')
        .then(res => {
          console.log(res)
          let resultBids = res.data[0].bids.filter(e => e[0] === 'LOC')
          let resultAsks = res.data[0].asks.filter(e => e[0] === 'LOC')
          assert.equal(resultBids.length, res.data[0].bids.length)
          assert.equal(resultAsks.length, res.data[0].asks.length)
        })
      })

      it('Deve retornar a lista filtrada por exchange=loc e por book.', () => {
        //O processo é análogo para outras exchanges
        return makeRequest('http://localhost:3030/order-book?book=bids&exchange=loc')
        .then(res => {
          let result = res.data[0].bids.filter(e => e[0] === 'LOC')
          assert.equal(result.length, res.data[0].bids.length)
        })
      })
    })

    describe('Order book # filters => price e volume (as validações são as mesmas)', () => {
      it('Deve retornar Bad Request se price é vazio ou não está num array.', () => {
        return makeRequest('http://localhost:3030/order-book?price=')
        .catch(res => {
          assert.equal(res.statusCode, 400)
        })
      })

      it('Deve fazer a consulta normalmente com os limites máximos e mínimos possíveis se o intervalo é [null,null].', () => {
        return makeRequest('http://localhost:3030/order-book?price[$between]=[null,null]')
        .then(res => {
          assert.equal(Object.keys(res.data[0]).length > 0, true)
        })
      })

      it('Deve fazer a consulta normalmente com os limites máximos ou mínimos se um deles é null.', () => {
        return makeRequest('http://localhost:3030/order-book?volume[$between]=[20000,null]')
        .then(res => {
          assert.equal(Object.keys(res.data[0]).length > 0, true)
        })
      })

      it('Deve fazer a consulta filtrando por price e por volume', () => {
        return makeRequest('http://localhost:3030/order-book?volume[$between]=[0,0.3]&price[$between]=[20000,21000]')
        .then(res => {
          let resultBidsPrice = res.data[0].bids.filter(e => e[1] <= 20000 && e[1] >= 21000)
          let resultBidsVolume = res.data[0].bids.filter(e => e[2] <= 0 && e[2] >= 0.3)
          let resultAsksPrice = res.data[0].asks.filter(e => e[1] <= 20000 && e[1] >= 21000)
          let resultAsksVolume = res.data[0].asks.filter(e => e[2] <= 0 && e[2] >= 0.3 )
          assert.equal(Object.keys(res.data[0]).length > 0, true)
          assert.equal(resultAsksPrice.length, 0)
          assert.equal(resultAsksVolume.length, 0)
          assert.equal(resultBidsPrice.length, 0)
          assert.equal(resultBidsVolume.length,0)
        })
      })
    })
  })
})


