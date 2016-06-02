const Todo = require('./command/todo.js');
const Dialogue = require('./command/dialogue.js');

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
      Todo(args, callback);
      break
    case "talk":
      Dialogue(args, callback);
      break
    default:
      callback();
      break
  }
}

module.exports = Bot;
