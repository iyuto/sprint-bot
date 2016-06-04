const Todo = require('./command/todo.js');
const Dialogue = require('./command/dialogue.js');
const Fitbit = require('./command/fitbit.js');
const Lastfm = require('./command/lastfm.js');

var Bot = function(message, id, callback) {
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
    case "fit":
      Fitbit(args, callback);
      break
    case "song":
      Lastfm(args, callback);
      break
    case "help":
      callback("see this: https://github.com/iyuto/sprint-bot/blob/master/answer.md");
      break
    case "name":
      if (args.length > 0) {
        prevName = userID[id];
        userID[id] = args.join(" ");
        callback(prevName + "が名前を[" + userID[id] + "]に変更しました。")
      }
      break
    default:
      callback();
      break
  }
}

module.exports = Bot;
