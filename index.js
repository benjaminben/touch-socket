const url     = require('url'),
      path    = require('path'),
      socks   = require('ws'),
      express = require('express')

const app     = express()
const server  = require('http').Server(app)
const wss     = new socks.Server({server})

let cs = []

app.use(express.static(path.join(__dirname, '/public')))

wss.on('connection', (ws, req) => {
  let location = url.parse(req.url, true)
  let initMessage = {type: 'connection', timestamp: Date.now()}
  ws.send(JSON.stringify(initMessage))
  cs.push(ws)
  console.log("New Client Connected :", cs.length)

  ws.on('message', msg => {
    console.log('received %s', msg)
    broadcast(msg)
  })

  ws.on('close', () => {
    cs = cs.filter(c => c === ws ? false : true)
    console.log('Client Left :', cs.length)
  })
})

server.listen(7000, () => {
  console.log('party on %d', server.address().port)
})

function broadcast(msg) {
  cs.forEach(ws => {
    ws.send(msg)
  })
}
