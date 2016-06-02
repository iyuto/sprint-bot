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
		
		switch (args[0]) {
			case "heart":
				getHeartRate(this.client, this.accessToken, callback);
				break
			case "step":
				getStep(this.client, this.accessToken, callback);
				break
			case "profile":
				getProfile(this.client, this.accessToken, callback);
				break
			default:
				argsError("Fitbit", callback);
		}
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

function getHeartRate(client, accessToken, callback) {
	client.get("/activities/heart/date/today/1d/1min.json", accessToken).then(function (results) {
		if (results[0]["activities-heart-intraday"].dataset.length == 0) {
			callback("There is no synced-data today.");
		} else {
			callback("My latest heart-rate: ♡" + results[0]["activities-heart-intraday"].dataset.pop().value);
		}
	}).catch(function (err) {
		console.log("Fitbit getHeartRate Error.");
	});
}

function getStep(client, accessToken, callback) {
	client.get("/activities/tracker/steps/date/today/1d.json", accessToken).then(function (results) {
		if (results[0]["activities-tracker-steps"].length == 0) {
			callback("There is no synced-data today.");
		} else {
			callback("Todays my steps: " + results[0]["activities-tracker-steps"].pop().value);
		}
	}).catch(function (err) {
		console.log("Fitbit getStep Error:" + err);
	});
}


function getProfile(client, accessToken, callback) {
	client.get("/profile.json", accessToken).then(function (results) {
		console.log(results[0]);
	}).catch(function (err) {
		console.log("Fitbit getProfile Error.");
	});
}

//todo: ここで引数helpを出す
function argsError(name, callback) {
	callback("argsError: " + name);
}

module.exports = Fitbit;