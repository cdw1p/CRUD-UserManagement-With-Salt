const express = require('express')
const path = require('path')
const cors = require('cors')
const compression = require('compression')
const expressMinify = require('express-minify-html-2')
const app = express()

app.enable('trust proxy')
app.disable('x-powered-by')
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.engine('ejs', require('ejs').__express)
app.use(express.static('public', { maxAge: 31557600 }))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use(compression())
app.use(expressMinify({
  override: true,
  exception_url: false,
  htmlMinifier: {
    removeComments: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: true,
    removeEmptyAttributes: true,
    minifyJS: true
  }
}))

const Routes = require('./routes')
Routes.initialize(app)

module.exports = app