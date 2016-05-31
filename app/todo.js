var mongoose = require('mongoose');

var Todo = function(data) {
	this.args = data;
}

Todo.prototype.excuteCmd = function() {
	switch (this.args[0]) {
		case "add":
			if (this.args.length > 2) return addTask(this.args);
			else {
				console.log("引数エラー(%s)", this.args.join(" "))
				return null;
			}
		case "delete":
			if (this.args.length == 2) return deleteTask(this.args)
			else {
				console.log("引数エラー(%s)", this.args.join(" "))
				return null;
			}
		case "list":
			if (this.args.length == 1) return listTask()
			else {
				console.log("引数エラー(%s)", this.args.join(" "))
				return null;
			}
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

function deleteTask(args) {
	console.log("deleteTask was called")
	return null;
}

function listTask() {
	console.log("listTask was called")
	return null;
}


module.exports = Todo;