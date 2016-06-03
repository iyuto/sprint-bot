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

var userID = [];

wss.on('connection', function(ws) {
  userID.push({id:ws._socket._handle.fd, name:ws._socket._handle.fd});
  broadcast(ws._socket._handle.fd + "が参加しました. 現在の参加人数:" + wss.clients.length, "host");
  
  ws.on('close', function() {
    var fd = wss.clients.map(function(client) {
      return client._socket._handle.fd;
    });
    userID = userID.filter(function(user) {
      if (fd.indexOf(user.id) == -1) {
        broadcast(user.name + "が退出しました. 現在の参加人数:" + wss.clients.length, "host");
        return false
      } else {
        return true
      }
    });
  });
  ws.on('message', function (message) {
    broadcast(message, ws._socket._handle.fd);
    Bot(message, function(replyMsg){
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
  console.log("Reply: ", data);
}

server.on('request', app);
server.listen(port, function () { console.log('Listening on ' + server.address().port) });
