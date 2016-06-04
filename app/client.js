'use strict';

var host = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(host);

$(function () {
  $('form').submit(function(){
    var $this = $(this);
    // ws.onopen = function() {
    //   console.log('sent message: %s', $('#m').val());
    // };
    ws.send($('#m').val());
    $('#m').val('');
    return false;
  });
  ws.onmessage = function(msg){
    var returnObject = JSON.parse(msg.data);
    $('#messages').append($('<li>').append($('<span class="clientId">').text(returnObject.id + ": ")).append($('<span class="clientMessage">').text(returnObject.data)));
  };
  ws.onerror = function(err){
    console.log("err", err);
  };
  ws.onclose = function close() {
    console.log('disconnected');
  };
});
