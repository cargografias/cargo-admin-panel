var loginController = require('./controllers/login')
var normalController = require('./controllers/normal')
var adminController = require('./controllers/admin')
var basicAuth = require('basic-auth-connect');

function checkLogin(req, res, next){
    
    //Check used logged in, if not redirect to login

    if(!req.session.user){
        res.redirect("/login");
    }else{
        next();
    }

};


function init(app){

	app.use('/', loginController);
	app.use('/', checkLogin, normalController);

	// Admin Routes
	var adminAuth = basicAuth(process.env.ADMIN_USER, process.env.ADMIN_PASSWORD);
	app.use('/admin', adminController);

	//TODO validate that /admin/* is also validated 

}

module.exports = {
	init: init
}
