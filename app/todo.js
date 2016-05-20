var mongoose = require('mongoose');

var Todo = function(data) {
	this.args = data;
}

Todo.prototype.excuteCmd = function() {
	switch (this.args[0]) {
		case "add":
			if (this.args[1]) return addTask(this.args);
			else return null;
		default:
			return null;
	}
}

function addTask(args) {
	mongoose.connect('mongodb://localhost/todo', function(err) {
	  if (err) console.log(err);
	  else console.log("mongoose connection success");
	});
	
	var TaskScheme = new mongoose.Schema({
		title: {type: String, require: true, unique: true},
		description: {type: String, require: true}
	});
	var Task = mongoose.model('Todo', TaskScheme);
	
	var task = new Task();
	task.title = args[1];
	task.description = args.join(" ");
	task.save(function(err) {
	  if (err) { console.log(err); }
	  else { console.log("task add success")}
	});
	
	return "task added."
}



module.exports = Todo;