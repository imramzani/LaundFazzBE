const app = require("../app")
const http = require('http')
const server = http.createServer(app);
const portServer = process.env.PORT || 3000

server.listen(portServer, () => {
    console.log(`server on PORT ${portServer}`)
  })
  
  module.exports = server;