const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('view engine', 'ejs')

app.get('/read', function (req, res) {
  const express = require('express')
  app.use(express.static(path.join(__dirname)))
  res.sendFile(path.join(__dirname, './', 'data.txt'))
})

app.post('/write/:data', function (request, respond) {
  let stringToAppend = request.params.data
  const filePath = 'data.txt'
  stringToAppend += '\n'
  fs.appendFile(filePath, stringToAppend, function () {
    respond.end('Ended!')
  })
})

app.put('/update/:linenumber', function (req, res) {
  const linenumber = req.params.linenumber
  const filePath = 'data.txt'
  let dataArray = []
  console.log(linenumber)
  console.log(req.body.value)
  fs.readFile(filePath, function (err, data) {
    if (err) {
      console.log(err)
    } else {
      dataArray = data.toString().split('\n')
      console.log(dataArray.length)
      if (linenumber <= dataArray.length) {
        dataArray[linenumber] = req.body.value
        const stringToWrite = dataArray.join('\n').toString()
        console.log(dataArray)
        fs.writeFileSync(filePath, stringToWrite)
        res.end('Done!')
      } else {
        res.sendStatus(500)
      }
    }
  })
})

app.delete('/destroy/:linenumber', function (req, res) {
  const linenumber = req.params.linenumber
  const filePath = 'data.txt'
  console.log(linenumber)
  console.log(req.body.value)
  fs.readFile(filePath, function (err, data) {
    if (err) {
      console.log(err)
    } else {
      let dataArray = []
      dataArray = data.toString().split('\n')
      console.log(dataArray.length)
      if (linenumber <= dataArray.length) {
        dataArray.splice(linenumber, 1)
        const stringToWrite = dataArray.join('\n').toString()
        console.log(dataArray)
        fs.writeFileSync(filePath, stringToWrite)
        res.end('Done!')
      } else {
        res.sendStatus(500)
      }
    }
  })
})

app.listen(3000, function () {
  console.log('Started on PORT 3000')
})
