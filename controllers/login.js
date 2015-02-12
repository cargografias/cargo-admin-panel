var express = require('express');
var router = express.Router();
var crypto = require('crypto');

router.get('/login', function(req, res){
	if(req.session.user){
		res.redirect('/')
	}else{
		res.render('login', {});
	}
})

router.post('/login', function(req, res){
	console.log(req.body)
	if(req.body.username =='demo@demo.com' && req.body.password == 'demo'){
		req.session.user = {
			username: 'demo@demo.com',
			email: 'demo@demo.com', 
			emailHash: crypto.createHash('md5').update('demo@demo.com').digest('hex')
		}
		res.redirect('/')
	}else{
		res.render('login', {
			error: 'Wrong username or password'
		})
	}
})

router.get('/logout', function(req, res){
	req.session.destroy();
	res.redirect('/login');
})

module.exports = router;