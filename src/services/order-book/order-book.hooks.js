const commonHooks = require('feathers-hooks-common')

const Before = require('./hooks/before.hooks')
const After = require('./hooks/after.hooks')

module.exports = {
  before: {
    all: [],
    find: [Before.onFind],
    get: [commonHooks.disallow()],
    create: [commonHooks.disallow('external')],
    update: [commonHooks.disallow('external')],
    patch: [commonHooks.disallow()],
    remove: [commonHooks.disallow()]
  },

  after: {
    all: [],
    find: [After.onFind],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
