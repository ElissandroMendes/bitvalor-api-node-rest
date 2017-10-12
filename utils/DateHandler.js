const MomentTZ = require('moment-timezone')

const getOnTimezone = (date, timezone) => MomentTZ.tz(date, timezone || 'America/Sao_Paulo')

module.exports = {
  diff: (date1,date2,unity,timezone) =>
    getOnTimezone(date1,timezone).diff(getOnTimezone(date2,timezone),unity)
}
