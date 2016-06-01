var Todo = require('./todo.js');

var Bot = function(message, callback) {
  if (message.match(/^(bot\b.+)/)) {
    var command = message.split(" ")[1];
    var args = message.split(" ").slice(2); //could be empty
  }
  
  switch (command) {
    case "ping":
      callback("pong");
      break
    case "todo":
      Todo(args, function(message){
        callback(message);
      });
      break
    default:
      callback();
      break
  }
}

module.exports = Bot;
