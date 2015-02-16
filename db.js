module.exports = {};

var mongoose = require('mongoose');

require('dotenv').load();

if(!process.env.MONGO_DB_URL){
	throw "Missing process.env.MONGO_DB_URL";
}

mongoose.connect(process.env.MONGO_DB_URL);

module.exports.CargoInstance = mongoose.model('CargoInstances', { 

	instanceName: String, 
	popitUrl: String, 
	status: String, 
	username: String, 
	email: String, 
	emailHash: String, 
	isAdmin: Boolean,
	password: String, 
	created: {
		type: Date, 
		default: Date.now
	}

});

