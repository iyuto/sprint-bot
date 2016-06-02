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
			console.log(recentTracks.track[0]);
			callback((recentTracks.track[0]["@attr"].nowplaying ? "NowPlaying♪♪: " : "Recent Track: ") +
				recentTracks.track[0].name +
				" (" + recentTracks.track[0].artist["#text"] + ")"
			);
		} else console.log("Last.fm getRecentTracks Error" + err);
	});
}

module.exports = Lastfm;