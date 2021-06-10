const serverPort = process.env.PORT || 8000
const server = require('./app')

server.use('*', function (req, res) {
  return res.redirect(`${req.protocol}://${req.headers.host}/`)
})

server.listen(serverPort, () => console.info(`Web server listening on port ${serverPort}`))