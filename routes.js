var controllers = require('./controllers')

function checkLogin(req, res, next){
    
    //Check used logged in, if not redirect to login

    if(!req.session.user){
        res.status(401).redirect("/login");
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

function init(app){

	app.get('/login', controllers.login);
	app.post('/login', controllers.loginPost);
	app.get('/logout', controllers.logout);
	
	app.use('/', checkLogin);
	app.get('/', controllers.home);
	
	//app.use('/api/*', checkLogin);

	app.post('/api/create', checkAdmin, controllers.create)
	app.get('/api/instances', checkAdmin, controllers.instances)
	// app.post('/api/updateMyInstance', controllers.updateMyInstance)
	// app.get('/api/currentbuildstatus/:instancename', checkAdmin, controllers.currentBuildStatus)
	// app.get('/api/instances', checkAdmin, controllers.instances)

}

module.exports = {
	init: init
}
