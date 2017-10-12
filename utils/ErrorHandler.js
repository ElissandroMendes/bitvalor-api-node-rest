const FeathersErrors = require('feathers-errors')

const errors = {
  'paramsNotDefault': 'Parâmetros inválidos. Informe apenas os parâmetros orderType,name,price e volume ',
  'minumInterval': 'Aguarde 1 minuto para fazer nova requisição'
}

module.exports = {
  throwError: (error, errorType, params) => {
     throw new FeathersErrors.errors[errorType || 'BadRequest'](`Erro: errors[error]: ${params}`)
  }
}
