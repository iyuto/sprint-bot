var Bot = function(message) {
  this.message = message;
  
  if (message.match(/^(bot\b.+)/)) {
    this.command = message.split(" ")[1];
    this.args = message.split(" ").slice(2);
  }
}

Bot.prototype.excuteCmd = function() {
  switch (this.command) {
    case "ping":
      return "pong";
    case "todo":
      return this.todo()
    default:
      return null;
  }
}

module.exports = Bot;
