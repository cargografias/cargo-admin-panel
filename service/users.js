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

module.exports.getUserForImpersonation = function(username){

	var deferred = Q.defer();

	db.CargoInstance.findOne({ username : username }, function(err, cargoInstance){
		
		if(err){
			console.log('login error querying for existing instances', err);		
			deferred.reject("Log In error");
		}else{

			if(cargoInstance){
				var user = getUserObjFromCargoInstance(cargoInstance);
				deferred.resolve(user);
			}else{
				deferred.reject("Invalid username");
			}
		}
	});

	return deferred.promise;

}

module.exports.updatePassword = function(user, password){

	var deferred = Q.defer();

	if(password.length < 6){

		deferred.reject("Error - password is too short");

	}else{

		db.CargoInstance.findOne({ username : user.username }, function(err, cargoInstance){
			
			if(err){
				console.log('error querying for existing instances', err);		
				deferred.reject("Error retrieving user");
			}else{

				if(cargoInstance){
					
					cargoInstance.password = crypto.createHash('sha1').update( password ).digest('hex');
					
					cargoInstance.save(function(err){
		  			
		  			if(err){
		  				console.log('ERror updating password', err);
		  				deferred.reject("Error updating password")
		  			}else{
		  				deferred.resolve();
		  			}

		  		})

				}else{
					deferred.reject("User not found");
				}
			}
		});

	}

	return deferred.promise;

}

