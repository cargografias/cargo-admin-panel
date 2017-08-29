module.exports = {};

var mongoose = require('mongoose');

require('dotenv').load();

process.env.MONGO_DB_URL = 'mongodb://localhost/cargo';

mongoose.connect(process.env.MONGO_DB_URL, {}, function(){
	console.log('connected to mongo');
});

module.exports.CargoInstance = mongoose.model('CargoInstances', { 

	instanceName: String, 
	popitUrl: String, 
	popitApiKey: String, 
	status: String, 
	username: String, 
	email: String, 
	emailHash: String, 
	lastUpdate: Number, 
	isAdmin: Boolean,
	password: String, 
	customization: mongoose.Schema.Types.Mixed,
	created: {
		type: Date, 
		default: Date.now
	}

});

