var express = require('express');
var router = express.Router();

router.get('/login', function(req, res){
	if(req.session.user){
		res.redirect('/')
	}else{
		res.render('login', {});
	}
})

router.post('/login', function(req, res){
	console.log(req.body)
	if(req.body.username =='demo' && req.body.password == 'demo'){
		req.session.user = {
			username: 'demo', 
			email: 'demo@demo.com'
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