const chai = require('chai')
const url = require('url')
const expect = chai.expect
const request = require('request')

describe('read Data from server', function () {
  it('should return array of objects from the database', function (done) {
    const options = {
      method: 'GET',
      url: 'http://localhost:3000/read',
      headers:
      {
        'postman-token': 'dc593fe8-3673-153d-134f-c5a9f6328561',
        'cache-control': 'no-cache'
      }
    }
    const dataArray = [
      {"id":231,"description":"code","status":false},
      {"id":232,"description":"eat","status":true},
      {"id":233,"description":"sleep","status":true},
      {"id":234,"description":"repeat","status":false}
    ]

    request(options, function (error, response, body) {
      if (error) throw new Error(error)
      expect(body).to.be.equal(JSON.stringify(dataArray))
      done()
    })
  })
})

