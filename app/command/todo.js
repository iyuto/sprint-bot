const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/bot'
mongoose.connect(mongoURI, function(err) {
	if (err) console.log("mongoose connection error: ", err);
	else console.log("mongoose connection success");
});

var TaskScheme = new mongoose.Schema({
	title: {type: String, require: true, unique: true},
	description: {type: String, require: true}
});
var Task = mongoose.model('Todo', TaskScheme);

var Todo = function(data, callback) { //data could be empty array
	this.name = data[0] //operation name
	this.args = data.slice(1); //other arguments
	console.log("Todo: ", this.name, this.args);
		
	switch (this.name) {
		case "add":
			addTask(this.args, callback);
			break
		case "delete":
			deleteTask(this.args, callback);
			break
		case "list":
			listTask(this.args, callback);
			break
		default:
			argsError("Todo", callback);
	}
}

module.exports = Todo;

function addTask(args, callback) {
	if (args.length < 2) {
		argsError("add", callback);
		return
	}
	
	var item = {
		title: args[0],
		description: args.slice(1).join(" ")
	}
	Task.update({title:args[0]}, item, {upsert: true}, function(err) {
		if(!err) callback("todo added");
		else callback("mongoose todo update error: " + err.name);
	});
}

function deleteTask(args, callback) {
	if (args.length != 1) {
		argsError("delete", callback);
		return
	}
	
	Task.findOne({title: args[0]}, function(err, task) {
		if (!err && task) {
			task.remove(function(err) {
				if (!err) {
					callback("todo deleted")
				} else {
					callback("mongoose delete error: " + err.name)
				}
			});
		} else {
			callback("todo not found: " + args[0])
		}
	});
}

function listTask(args, callback) {
	if (args.length != 0) {
		argsError("list", callback);
		return
	}
	Task.find({}, function(err, docs) {
		if(!err) {
			if (docs.length == 0) callback("todo empty")
			else var message = ""
			for(var i=0; i<docs.length; i++) {
					message += docs[i].title + " " + docs[i].description + "\n"
			}
			callback(message);
		} else {
			callback("mongoose find error:" + err.name);
		}
	});
}

//todo: ここで引数helpを出す
function argsError(name, callback) {
	callback("argument error: " + name);
}
