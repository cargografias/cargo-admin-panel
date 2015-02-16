var express = require('express');
var popitService = require('./service/popit.js')
var usersService = require('./service/users.js')

module.exports = {};

module.exports.create = function(req, res) {
  
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

	popitService.getAllInstances()
	.then(function(list){
		res.send(list);
	})
	.catch(function(error){
		res.send(error);
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

