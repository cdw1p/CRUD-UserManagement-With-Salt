const express = require('express')
const router = express.Router()

module.exports.initialize = function(app) {
  app.use('/',
    router.get('/', (req, res) => {
      res.send('Hello World!')
    })
  )
}