const request = require('request');
const mongoose = require('mongoose');

const DOCOMO_DIALOGUE_URL = "https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue?APIKEY=" + process.env.NODE_DIALOGUE_APIKEY;
const header = {'Content-Type':'application/json'};

const DialogueScheme = new mongoose.Schema({
	context: {type: String, require: true, unique: true},
	id: {type: Number, require: true, unique: true}
});
const Context = mongoose.model('Dialogue', DialogueScheme);

var Dialogue = function(data, callback) {
	this.message = data.join(" ");
	
	if (this.message.length > 255) {
		callback("talkコマンドの本文は255文字以下です");
		return
	}
	
	getContext(function(context) {
		postMsg(this.message, context, callback);
	});
}

function getContext(callback) {
	Context.findOne({id:1}, function(err, context) {
		if (!err && context) {
			 console.log(context);
			 callback(context.context);
		} else if (!err) {
			callback();
		} else console.log("mongoose get error: findOne");
	});
}

function saveContext(data) {
	Context.findOne({id:1}, function(err, res) {
		if (!err && res) {
			console.log(res);
			res.update({context: data}, function(err) {
				if (!err) console.log("Context saved.(update)");
				else console.log("mongoose save error: update");
			});
		} else if (!err) {
			var context = new Context();
			context.context = data;
			context.id = 1;
			context.save(function(err) {
			  if (err) console.log(err.name);
			  else console.log("context added.(new save)");
			});
		} else console.log("mongoose save error: findOne");
	});
}

function postMsg(message, context, callback) {
	var options = {
		url: DOCOMO_DIALOGUE_URL,
		headers: {'Content-Type':'application/json'},
		json: true,
		body: {"utt": message, "context": context}
	}
	
	request.post(options, function(err, response, body) {
		if (!err && response.statusCode == 200) {
			console.log(body);
			saveContext(body.context);
			callback(body.utt);
		} else {
			console.log(response.body);
			callback("POST ERROR:" + response.statusCode);
		}
	});
}


module.exports = Dialogue;