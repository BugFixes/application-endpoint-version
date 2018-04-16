/* global it, describe, before, after */
require('dotenv').config()
const bugfixes = require('bugfixes')
const mockyeah = require('mockyeah')

const underTest = require('../src')

const expect = require('chai').expect

const payLoadValid = {
  "resource": "/application/version",
  "path": "/v1/application/version",
  "httpMethod": "POST",
  "headers": {
    "CloudFront-Forwarded-Proto": "https",
    "CloudFront-Is-Desktop-Viewer": "true",
    "CloudFront-Is-Mobile-Viewer": "false",
    "CloudFront-Is-SmartTV-Viewer": "false",
    "CloudFront-Is-Tablet-Viewer": "false",
    "CloudFront-Viewer-Country": "GB",
    "Content-Type": "application/json; charset=utf-8",
    "Host": "account.bugfix.es",
    "User-Agent": "Paw/3.1.5 (Macintosh; OS X/10.13.4) GCDHTTPRequest",
    "Via": "1.1 823355654d69efaf19d467269c43b83a.cloudfront.net (CloudFront)",
    "X-Amz-Cf-Id": "vdr-ndAQGr6glTbrjgFPP67dH7YJ4F5EZW-YwM_cFIOAKNF-aTeXkQ==",
    "X-Amzn-Trace-Id": "Root=1-5acb82f6-58d4bf48609b48804f96551c",
    "X-API-KEY": "FqeFIjvhgi3etnvwWmpsj64SRNmf11rM99Ve369R",
    "X-Forwarded-For": "37.157.242.120, 54.240.156.47",
    "X-Forwarded-Port": "443",
    "X-Forwarded-Proto": "https",
    "authyId": process.env.TEST_ACCOUNT_ID_VALID
  },
  "queryStringParameters": null,
  "pathParameters": null,
  "stageVariables": null,
  "requestContext": {
    "resourceId": "db8q1j",
    "resourcePath": "/application/version",
    "httpMethod": "POST",
    "extendedRequestId": "FFFmjH7YrPEFt_g=",
    "requestTime": "09/Apr/2018:15:12:54 +0000",
    "path": "/v1/application/version",
    "accountId": "369633732598",
    "protocol": "HTTP/1.1",
    "stage": "Live_v1",
    "requestTimeEpoch": 1523286774745,
    "requestId": "7a7ff09f-3c08-11e8-957a-a3725751a011",
    "identity": {
      "cognitoIdentityPoolId": null,
      "cognitoIdentityId": null,
      "apiKey": "FqeFIjvhgi3etnvwWmpsj64SRNmf11rM99Ve369R",
      "cognitoAuthenticationType": null,
      "userArn": null,
      "apiKeyId": "jtiqpzjpl0",
      "userAgent": "Paw/3.1.5 (Macintosh; OS X/10.13.4) GCDHTTPRequest",
      "accountId": null,
      "caller": null,
      "sourceIp": "37.157.242.120",
      "accessKey": null,
      "cognitoAuthenticationProvider": null,
      "user": null
    },
    "apiId": "437o1c2113"
  },
  "body": "{\"version\":\"0.0.2\", \"name\":\"TrackLines\", \"applicationId\":\"" + process.env.TEST_APPLICATION_ID + "\"}",
  "isBase64Encoded": false
}

process.env.AUTHY_URL = 'http://127.0.0.1:4001/protected/json'
// process.env.AWS_DYNAMO_ENDPOINT = 'http://docker.devel:8000'

describe('Application Version Endpoint', () => {
  it('should create app version', (done) => {
    underTest(payLoadValid, console, (error, result) => {
      if (error) {
        done(Error(error))
      }

      expect(result).to.be.an('object')
      expect(result).to.have.property('body')

      let resultBody = JSON.parse(result.body)
      expect(resultBody).to.have.property('message')

      let resultObj = resultBody.message
      expect(resultObj).to.be.an('object')
      expect(resultObj).to.have.property('key')
      expect(resultObj.key).to.be.lengthOf.least(4)
      expect(resultObj).to.have.property('secret')
      expect(resultObj.secret).to.be.lengthOf.least(4)

      done()
    })
  })
})