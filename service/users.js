var crypto = require('crypto');
var Q = require('q');
var db = require('../db')

function getUserObjFromCargoInstance(cargoinstance){
	return {
		username: cargoinstance.username,
		email: cargoinstance.email, 
		emailHash: cargoinstance.emailHash,
		isAdmin: cargoinstance.isAdmin, 
		instanceName: cargoinstance.instanceName, 
		popitUrl: cargoinstance.popitUrl
	};
}

module.exports.validateUser = function (username, password) {

	var deferred = Q.defer();

	db.CargoInstance.findOne({ username : username }, function(err, cargoInstance){
		
		if(err){
			console.log('login error querying for existing instances', err);		
			deferred.reject("Log In error");
		}else{

			if(cargoInstance){

				var sha1Pwd = crypto.createHash('sha1').update(password).digest('hex')
				console.log('comparing passwords ', cargoInstance.password, sha1Pwd)
				if(cargoInstance.password == sha1Pwd){
					var user = getUserObjFromCargoInstance(cargoInstance);
					deferred.resolve(user);
				}else{
					deferred.reject("Invalid username or password");
				}

			}else{

				deferred.reject("Invalid username or password");
			}
		}
	});

	return deferred.promise;

}


