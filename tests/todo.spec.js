'user strict';

var assert = require('chai').assert,
    WebSocket = require('ws'),
    setWsProtocol = require('./utils').setWsProtocol,
    host_url = process.env.HOST_URL || require('../config/account.json').host_url;

describe('Bot todo', function() {
  this.timeout(30000);
  var
    forAdd = [
      {command: "check1", data: "add1"},
      {command: "check2", data: "add2"}
    ],
    forList = [
      {command: "eat",  data: "pizza"},
      {command: "watch",  data: "Hellsing"},
      {command: "dinner",  data: "SpiceGarden"},
      {command: "goto",  data: "gym"},
      {command: "do",  data: "assignments"},
      {command: "sleep",  data: "early"},
      {command: "try",  data: "websocket"},
      {command: "firdays",  data: "beer"},
      {command: "gofor",  data: "meetup"},
      {command: "read", data: "1Q84"},
    ];

  beforeEach(function (done) {
    var num1 = 1, num2 = 0;
    var addList = forAdd.map((v) => { return v.command; });
    var deleteList = forList.map((v) => { return v.command; });
    var allcmdList = addList.concat(deleteList);
    var tempClient = new WebSocket(setWsProtocol(host_url));

    var deleteCommandList = [];

    //Please note that for tests to pass you have to implement the `bot todo delete` and `bot todo list` command 
    //num1 is incremented while sending the bot todo command and num2 is incremented while receiving the response
    tempClient.onopen = function() {
      tempClient.send("bot todo list");
      //num1 is already set to 1 as we are sending this command first when the tests run
      tempClient.onmessage = function(msg) {
        num2++;
        var returnObject = JSON.parse(msg.data);
        if(num2 === 1)
          assert.equal(returnObject.data, "bot todo list");
        else if(num2 === 2) {
          if(returnObject.data === "todo empty"){
            tempClient.close();
            done(); 
          }
          else if(returnObject.data.split('\n').length > 0){
            deleteCommandList = returnObject.data.split('\n');
            deleteCommandList.forEach((v) => {
              num1++;
              tempClient.send("bot todo delete " + v.split(" ")[0]);
            });
          }
        }
        else if(num2 === num1*2){
          tempClient.close();
          done();
        }
      };
    };
  });

  it('bot todo add - should return "todo added" if success', function(done) {
    var responseMessageCount = 0;
    var client1 = new WebSocket(setWsProtocol(host_url));
    var commandToAdd = "bot todo add check1 add1";

    client1.onopen = function() {
      client1.send(commandToAdd);      
      client1.onmessage = function(msg) {
        responseMessageCount++;
        if(responseMessageCount === 1) {
          var returnObject = JSON.parse(msg.data);
          assert.equal(returnObject.data, commandToAdd);
        }
        else if(responseMessageCount === 2) {
          var returnObject = JSON.parse(msg.data);
          assert.equal(returnObject.data, "todo added");
          client1.close();
          done();
        }
      }; 
    };
  });

  it('bot todo delete - should return "todo deleted" if success', function(done) {
    var client1 = new WebSocket(setWsProtocol(host_url));

    client1.onopen = function() {
      client1.send("bot todo add " + forAdd[0].command + " " + forAdd[0].data);      
      client1.onmessage = function(msg) {
        var returnObject = JSON.parse(msg.data);
        if(returnObject.data === "todo added") {
          client1.send("bot todo delete " + forAdd[0].command);
        }
        else if(returnObject.data === "todo deleted") {
          client1.close();
          done();
        }
      };
    };
  });

  it('bot todo list - Response data of bot todo list should be separated with \n', function(done) {
    var commandCount = 0;
    var client1 = new WebSocket(setWsProtocol(host_url));
    var textArray = [];

    forList.forEach((v) => {
      textArray.push(v.command + " " + v.data);
    });

    client1.onopen = function() {
      for (var i = 0; i < forList.length; i++) {
        commandCount++;
        client1.send("bot todo add " + forList[i].command +  " " + forList[i].data);
      }
      if(commandCount === forList.length) {
        commandCount++;
        client1.send("bot todo list");
      }
      client1.onmessage = function(msg) {
        var returnObject = JSON.parse(msg.data);
        if(compareArrays(returnObject.data.split('\n').sort(), textArray.sort())){
          client1.close();
          done();
        }
      };
    };
    var compareArrays = function(a, b) {
      if(a.length===b.length && a.every((v,i) => v === b[i]))
        return true;
      else return false;
    }
  });

});

