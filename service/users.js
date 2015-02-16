var crypto = require('crypto');
var Q = require('q');

var users = {

	"demo@demo.com": {
		username: 'demo@demo.com',
		email: 'demo@demo.com', 
		emailHash: crypto.createHash('md5').update('demo@demo.com').digest('hex')
	}, 

	"admin@cargografias.org": {
		username: 'admin@cargografias.org',
		email: 'admin@cargografias.org', 
		emailHash: crypto.createHash('md5').update('admin@cargografias.org').digest('hex'), 
		isAdmin: true
	}

}

var passwords = {
	"demo@demo.com" : "demo", 
	"admin@cargografias.org": "admin"	
};


module.exports.validateUser = function (username, password) {

	var deferred = Q.defer();

	setTimeout(function(){

		if( passwords[username] && passwords[username] == password ){
			deferred.resolve(users[username]);
		}else{
			deferred.reject();
		}
		
	}, 1000)

	return deferred.promise;

}