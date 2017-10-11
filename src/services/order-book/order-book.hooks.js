const commonHooks = require('feathers-hooks-common')

module.exports = {
  before: {
    all: [],
    find: [],
    get: [commonHooks.disallow()],
    create: [commonHooks.disallow()],
    update: [commonHooks.disallow()],
    patch: [commonHooks.disallow()],
    remove: [commonHooks.disallow()]
  },

  after: {
    all: [],
    find: [],
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
