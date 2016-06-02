const mongoose = require('mongoose');
const FitbitApiClient = require('fitbit-node');
const FITBIT_CLIENT_ID = process.env.NODE_FITBIT_CLIENT_ID;
const FITBIT_CLIENT_SECRET = process.env.NODE_FITBIT_CLIENT_SECRET;
const FITBIT_CODE = process.env.NODE_FITBIT_CODE;
const CALLBACK_URL = "http://localhost:3000/callback";

const TokenScheme = new mongoose.Schema({
	title: {type: String, require: true, unique: true},
	access_token: {type: String, require: true},
	refresh_token: {type: String, require: true},
	expire_time: {type: Number}
});
var Token = mongoose.model('Token', TokenScheme);

function Fitbit() {
	this.client = new FitbitApiClient(FITBIT_CLIENT_ID, FITBIT_CLIENT_SECRET);
	// var redirect_uri = this.client.getAuthorizeUrl("activity heartrate profile settings sleep", CALLBACK_URL);
	// console.log("fitbit authorize callbacked: ", redirect_uri);
	// this.client.getAccessToken(FITBIT_CODE, CALLBACK_URL).then(function (result) {
	// 	console.log(result);
	// }).catch(function (err) {
	// 	console.log(err);
	// });
}

Fitbit.prototype.isExpire = function (callback) {
	if (Math.floor(Date.now()/1000) <= this.expireTime) {
		this.client.refreshAccesstoken(this.accessToken, this.refreshToken).then(function (result) {
			console.log("Fitbit token refreshed.");
			this.accessToken = result.access_token;
			this.refreshToken = result.refresh_token;
			this.expireTime = Math.floor(Date.now()/1000) + result.expire_time;
		}).catch(function (err) {
			console.log(err);
		});
		callback();
	} else callback();
}

Fitbit.prototype.saveToken = function (accessToken, refreshToken, expireTime) {
 	item = {
		access_token: accessToken,
		refresh_token: refreshToken,
		expire_time: expireTime
	}
	Token.update({title: "Fitbit"}, item, {upsert: true}, function(err) {
		if (!err) console.log("mongoose fitbit token saved.");
		else console.log("mongoose fitbit save token error: " +  err);
	});
}

Fitbit.prototype.getToken = function (callback) {
	Token.findOne({title: "Fitbit"}, function(err, token) {
		if (!err && token) {
			this.accessToken = token.access_token;
			this.refreshToken = token.refresh_token;
			this.expireTime = token.refresh_token;
			
			this.isExpire(function (){
				console.log("Fitbit access_token: " + this.accessToken);
				console.log("Fitbit refresh_token: " + this.refreshToken);
			});
			callback();
		} else console.log("Fitbit token not found");
	});
}

Fitbit.prototype.getProfile = function () {
	this.client.get("/profile.json", this.accessToken).then(function (results) {
		console.log(results);
	}).catch(function (err) {
		console.log(err);
	});
}






module.exports = Fitbit;