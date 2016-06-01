const Bot = require('./bot.js')
const request = require('request')
const server = require('http').createServer()
const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const WebSocketServer = require('ws').Server
const wss = new WebSocketServer({ server: server })

app.use(express.static('app'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

wss.on('connection', function(ws) {
  ws.on('close', function() {
    wss.clients = wss.clients.filter(function (conn, i) {
      return (conn === ws) ? false : true;
    });
    broadcast("1名退出しました", "host");
  });
  ws.on('message', function (message) {
    broadcast(message, ws._socket._handle.fd);
    Bot(message, function(replyMsg){
      console.log("Reply: ", replyMsg);
      broadcast(replyMsg, ws._socket._handle.fd);
    });
  });
});

function broadcast(data, id) {
  if (!data) return
  var message = {data: data, id: id};
  wss.clients.forEach(function (client, i) {
    client.send(JSON.stringify(message));
  });
}

server.on('request', app);
server.listen(port, function () { console.log('Listening on ' + server.address().port) });
