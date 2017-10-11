const assert = require('assert')
const rp = require('request-promise')
const app = require('../src/app')

describe('Feathers application tests', () => {
  before(function(done) {
    this.server = app.listen(3030)
    this.server.once('listening', () => done())
  })

  after(function(done) {
    this.server.close(done)
  })

  it('Mostra a página inicial', () => {
    return rp('http://localhost:3030').then(body =>
      assert.ok(body.indexOf('<html>') !== -1)
    )
  })

  describe('404', function() {
    it('Mostra uma página de erro 404', () => {
      return rp({
        url: 'http://localhost:3030/path/to/nowhere',
        headers: {
          'Accept': 'text/html'
        }
      }).catch(res => {
        assert.equal(res.statusCode, 404)
        assert.ok(res.error.indexOf('<html>') !== -1)
      })
    })

    it('Mostra uma página de erro 404 com stack de erro', () => {
      return rp({
        url: 'http://localhost:3030/path/to/nowhere',
        json: true
      }).catch(res => {
        assert.equal(res.statusCode, 404)
        assert.equal(res.error.code, 404)
        assert.equal(res.error.message, 'Page not found')
        assert.equal(res.error.name, 'NotFound')
      })
    })
  })
})
