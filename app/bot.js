var Todo = require('./todo.js');

var Bot = function(message) {
  this.message = message;
  
  if (message.match(/^(bot\b.+)/)) {
    this.command = message.split(" ")[1];
    this.args = message.split(" ").slice(2);
    console.log("this.args: ", this.args);
  }
}

Bot.prototype.excuteCmd = function() {
  switch (this.command) {
    case "ping":
      return "pong";
    case "todo":
      var todo = new Todo(this.args);
      return todo.excuteCmd();
    default:
      return null;
  }
}

module.exports = Bot;
