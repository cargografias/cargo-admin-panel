var controllers = require('./controllers')

function checkLogin(req, res, next){
    
    //Check used logged in, if not redirect to login
    if(!req.session.user){
        res.redirect(401, "/login");
    }else{
        next();
    }

};

function checkAdmin(req, res, next){

	if(req.session.user && req.session.user.isAdmin){
		next();
	}else{
		res.status(401).send({ error : "unauthorized"} );
	}

}

function canImpersonate(req, res, next){
  if(req.session.user && req.session.user.username == 'admin'){
    next();
  }else{
    res.status(401).send({ error : "unauthorized"} ); 
  }
}

function init(app){

	app.get('/login', controllers.login);
	app.post('/login', controllers.loginPost);
	app.get('/logout', controllers.logout);
	
	app.use('/', checkLogin);  //Everything below this line gets checklogin 

	app.get('/', controllers.home);
	
	app.get('/api/myinfo', controllers.myinfo)
	app.post('/api/updatemyinstance', controllers.updateMyInstance)
	app.get('/api/mycurrentbuildstatus', controllers.myCurrentBuildStatus)

	app.post('/api/create', checkAdmin, controllers.create)
	app.get('/api/instances', checkAdmin, controllers.instances)

  app.post('/api/impersonate', checkAdmin, canImpersonate, controllers.impersonate)
  app.post('/api/password', controllers.password)

}

module.exports = {
	init: init
}
