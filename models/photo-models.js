var mongoose = require('mongoose');

var PhotoSchema = new mongoose.Schema({
	urls: [String]
});

var PhotoModel = mongoose.model('PhotoModel', PhotoSchema);