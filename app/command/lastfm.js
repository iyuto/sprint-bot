const LastfmAPI = require('lastfmapi');

function Lastfm(args, callback) {
	this.lfm = new LastfmAPI({
		"api_key": process.env.NODE_LASTFM_API_KEY,
		"secret": process.env.NODE_LASTFM_SECRET
	});
	
	var params = {
		limit: "3",
		user: "yazaqi"
	}
	this.lfm.user.getRecentTracks(params, function(err, recentTracks) {
		if(!err) {
			var d = new Date();
			d.setTime(recentTracks.track[0].date.uts * 1000);
			var dStr = (d.getMonth()+1) + "/" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + " -> "
			callback((recentTracks.track[0]["@attr"] ? "NowPlaying♪♪ -> " : dStr) +
				recentTracks.track[0].name +
				" (" + recentTracks.track[0].artist["#text"] + ")"
			);

		} else console.log("Last.fm getRecentTracks Error" + err);
	});
}

module.exports = Lastfm;