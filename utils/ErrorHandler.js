const FeathersErrors = require('feathers-errors')

const errors = {
  'paramsNotDefault': 'Parâmetros inválidos: '
}

module.exports = {
  getError: (error, errorType, params) => {
     throw new FeathersErrors.errors[errorType || 'BadRequest'](`Erro: ${errors[error] || 'Error'}: ${params}`)
  }
}
