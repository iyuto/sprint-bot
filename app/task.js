var TaskScheme = new mongoose.Schema({
	title: {type: String, require: true, unique: true},
	description: {type: String, require: true}
});

module.exports =  mongoose.model('Task', TaskScheme);