var Bot = require('./bot.js');

var
  server = require('http').createServer(),
  express = require('express'),
  app = express(),
  port = 3000;
var
  WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({ server: server });

app.use(express.static('app'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

wss.on('connection', function(ws) {
  ws.on('close', function() {
    wss.clients = wss.clients.filter(function (conn, i) {
      return (conn === ws) ? false : true;
    });
  });
  ws.on('message', function (message) {
    broadcast(message, ws._socket._handle.fd);
    var bot = new Bot(message);
    if (bot.command) {
      broadcast(bot.excuteCmd(), ws._socket._handle.fd)
    }
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
