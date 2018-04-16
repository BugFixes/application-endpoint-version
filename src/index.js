const bugfixes = require('bugfixes')
const ApplicationModel = require('bugfixes-application-models')
const AccountModel = require('bugfixes-account-models')
const Logs = require('bugfixes-account-logging')

const bugfunctions = bugfixes.functions

module.exports = (event, context, callback) => {
  let eventBody = JSON.parse(event.body)

  let log = new Logs()
  log.action = 'Create Version'
  log.content = {
    apiKey: event.requestContext.identity.apiKey,
    eventBody: eventBody
  }
  log.authyId = event.headers.authyId
  log.requestId = event.headers.requestId

  let account = new AccountModel()
  account.authyId = parseInt(event.headers.authyId)
  account.getAccount((error, result) => {
    if (error) {
      log.content.error = error
      log.send()

      bugfixes.error('Create Version', 'Account Check', error)

      return callback(error)
    }

    if (result.accountId) {
      let accountId = result.accountId

      log.accountId = accountId

      let application = new ApplicationModel()
      application.accountId = accountId
      application.applicationId = eventBody.applicationId
      application.name = eventBody.name
      application.version = eventBody.version
      application.createVersion((error, result) => {
        if (error) {
          log.content.error = error
          log.send()

          bugfixes.error('Create Version', 'Application', error)

          return callback(error)
        }

        log.send()

        return callback(null, bugfunctions.lambdaResult(8000, result))
      })
    } else {
      return callback(null, bugfunctions.lambdaError(8001, 'Invalid Account'))
    }
  })
}
