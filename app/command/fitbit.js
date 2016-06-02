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

function Fitbit(args, callback) {
	this.client = new FitbitApiClient(FITBIT_CLIENT_ID, FITBIT_CLIENT_SECRET);
	getToken(this.client, function(accessToken, refreshToken, expireTime) {
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
		this.expireTime = expireTime;
		console.log("Fitbit getToken done.");
		
	});
}

function getToken(client, callback) {
	Token.findOne({title: "Fitbit"}, function(err, token) {
		if (!err && token) {
			if (isExpire(token.expire_time)) {
				client.refreshAccesstoken(token.access_token, token.refresh_token).then(function (result) {
					console.log("Fitbit token refreshed.");
					saveToken(result.access_token, result.refresh_token, result.expires_in);
					callback(result.access_token, result.refresh_token, Math.floor(Date.now()/1000) + result.expires_in);
				}).catch(function (err) {
					console.log("fitbit token refresh error.");
				});
			} else {
				console.log("Fitbit getToken token is fresh.")
				callback(token.access_token, token.refresh_token, token.expire_time);
			}
		} else {
			var redirect_uri = client.getAuthorizeUrl("activity heartrate profile settings sleep", CALLBACK_URL);
			console.log("fitbit authorize callbacked: ", redirect_uri);
			
			client.getAccessToken(FITBIT_CODE, CALLBACK_URL).then(function (result) {
				console.log(result);
				saveToken(result.access_token, result.refresh_token, result.expires_in);
			}).catch(function (err) {
				console.log("Fitbit getAccessToken error. Please access following URL and confirm your authorization: \n" + redirect_uri);
				console.log("Then get code and set it as NODE_FITBIT_CODE on your ENV.")
			});
		}
	});
}

function isExpire(expireTime) {
	if (Math.floor(Date.now()/1000) >= expireTime)  return true
	else return false
}

function saveToken(accessToken, refreshToken, expiresIn) {
 	item = {
		access_token: accessToken,
		refresh_token: refreshToken,
		expire_time: Math.floor(Date.now()/1000) + expiresIn
	}
	Token.update({title: "Fitbit"}, item, {upsert: true}, function(err) {
		if (!err) console.log("mongoose fitbit token saved.");
		else console.log("mongoose fitbit save token error: " +  err);
	});
}

function getHeart() {
	this.client.get("/activities/heart/date/today/1d/1min.json", this.accessToken).then(function (results) {
		console.log(results);
	}).catch(function (err) {
		console.log(err);
	});
}

function getProfile() {
	this.client.get("/profile.json", this.accessToken).then(function (results) {
		console.log(results);
	}).catch(function (err) {
		console.log(err);
	});
}

module.exports = Fitbit;