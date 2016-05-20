var mongoose = require('mongoose');

var Todo = function(data) {
	this.data = data;
}

Todo.prototype.excuteCmd = function() {
	console.log("Todo command excuted.");
}

// mongoose.connect('mongodb://localhost/todo', function(err) {
//   if (err) { console.log(err) }
//   else { console.log("connection success"); }
// });
//
// var todo = new Todo();
// todo.title = "testtitle";
// todo.description = "description here.";
// todo.save(function(err) {
//   if (err) { console.log(err); }
//   else { console.log("success")}
// });
//
// var TodoScheme = new mongoose.Schema({
// 	title: {type: String, require: true, unique: true},
// 	description: {type: String, require: true}
// });
// mongoose.model('Todo', TodoScheme);

module.exports = Todo;