var express = require('express');
var popitService = require('./service/popit.js')
var usersService = require('./service/users.js')
var db = require('./db')
var request = require('request');

module.exports = {};

module.exports.create = function(req, res){

  var instanceName = req.body.instanceName;
  var popitUrl = req.body.popitInstance;
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var passwordRepeat = req.body.passwordRepeat;

  //Validations

  if(username.length < 4){
  
  	res.send({
  		status: 'error', 
  		message: 'Username too short (min 4 chars)'
  	});
  
  } else if( password != passwordRepeat ){

  	res.send({
  		status: 'error', 
  		message: "Passwords don't match"
  	});

  } else if ( password.length < 6 ) {

  	res.send({
  		status: 'error', 
  		message: "Password too short (min 6 chars)"
  	});

  } else {


	db.CargoInstance.findOne({ instanceName : instanceName }, function(err, cargoInstance){
		
		if(err){
			console.log('create validation error querying for existing instances', err);		
			res.send({status: 'error', message:'Error getting instances'})
		}else{

			if(cargoInstance){
				res.send({status: 'error', message:'Instance already created'})
			}else{
				//
				//Query code to popit:

				var url = "http://" + popitUrl + ".popit.mysociety.org/api/v0.1";
				console.log("querying url", url)
				request(url, function (err, response, body) {
				  
				  if(err){
				  	console.log("error validating popit instance", err)
				  	res.send({status: "error", message: "Error validating popit instance"})
				  }else{
				  	if(response.statusCode == 200){
				  		res.send({status: "ok", message: "Instance created"});
				  	}else{
				  		res.send({status: "error", message: "Popit instance not found"})
				  	}
				  }


				})

			}
		}
	});


  	

  }




 //  popitService.createAndUploadIntance(instanceName, popitUrl)
 //  	.then(function(instance){
	// 	res.send({
	// 		status: 'ok', 
	// 		message: 'enqueued ' + req.body.name
	// 	});
	// }).catch(function(error){
	// 	res.send({
	// 		status: 'error', 
	// 		message: 'error creating instance' + req.body.name + "\n" + error
	// 	});
	// });


}

module.exports.createAndUpdate = function(req, res) {
  
  var instanceName = req.body.name;
  var popitUrl = req.body.popitInstance;

  popitService.createAndUploadIntance(instanceName, popitUrl)
  	.then(function(instance){
		res.send({
			status: 'ok', 
			message: 'enqueued ' + req.body.name
		});
	}).catch(function(error){
		res.send({
			status: 'error', 
			message: 'error creating instance' + req.body.name + "\n" + error
		});
	});

};

module.exports.updateMyInstance = function(req, res){

};

module.exports.currentBuildStatus = function(req, res){
	// /api/currentbuildstatus/:instancename
	var instanceName = req.params.instancename;

	popitService.getInstanceProgress(instanceName).then(function(info){

		if(info){
			res.send({
				status: 'ok', 
				importStatus: info.status,
				log: info.log
			});			
		}else{
			res.send({
				status: 'error', 
				message: 'no data for instance'
			});
		}

	});

};

module.exports.instances = function(req,res){

	db.CargoInstance.find(function(err, data){
		res.send(data);
	})

};


module.exports.login = function(req, res){
	if(req.session.user){
		res.redirect('/')
	}else{ 
		res.render('login', {});
	}
};

module.exports.loginPost = function(req, res){

	usersService.validateUser(req.body.username, req.body.password)
	.then(function(user){
		req.session.user = user;
		res.redirect('/')
	})
	.catch(function(){
		res.render('login', {
			error: 'Wrong username or password'
		})
	});

};

module.exports.logout = function(req, res){
	req.session.destroy();
	res.redirect('/login');
};

module.exports.home = function(req, res){
	res.render('index', {
		user: req.session.user
	});
};

