var mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/todo'
mongoose.connect(mongoURI, function(err) {
	if (err) console.log("mongoose connection error: ", err);
	else console.log("mongoose connection success");
});

var TaskScheme = new mongoose.Schema({
	title: {type: String, require: true, unique: true},
	description: {type: String, require: true}
});
var Task = mongoose.model('Todo', TaskScheme);

var Todo = function(data) {
	this.name = data.split(" ")[0] //operation name
	this.args = data.split(" ").slice(1); //other arguments
	console.log("Todo: ", this.name, this.args);
}

Todo.prototype.excuteCmd = function() {
	switch (this.name) {
		case "add":
			if (this.args.length >= 2) return addTask(this.args);
			else return argsError(this.name)
		case "delete":
			if (this.args.length == 1) return deleteTask(this.args)
			else return argsError(this.name)
		case "list":
			if (this.args.length == 0) return listTask()
			else return argsError(this.name)
		default:
			return "todoコマンドの書式が違います"
	}
}

function argsError(name) {
	return "Error: " + name
}

function addTask(args) {
	
	
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
	console.log(args)
	return null;
}

function listTask() {
	console.log("listTask was called")
	console.log(args)
	return null;
}


module.exports = Todo;