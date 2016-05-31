var assert = require("chai").assert,
    WebSocket = require('ws'),
    setWsProtocol = require('./utils').setWsProtocol,
    host_url = process.env.HOST_URL || require('../config/account.json').host_url;

describe("Chat Server",function() {

  var responseMessageCount = 0;
  it('Should send back pong', function(done) { 
    var client1 = new WebSocket(setWsProtocol(host_url));

    client1.onopen = function() {
      client1.send("bot ping");
    };
    client1.onmessage = function(msg) {
      responseMessageCount++;
      var returnObject = JSON.parse(msg.data);

      if(responseMessageCount === 1) {
        assert.equal(returnObject.data, "bot ping");
      }
      else if(responseMessageCount === 2) {
        assert.equal(returnObject.data, "pong"); 
        client1.close();
        done();
      }
    };
  });

});
