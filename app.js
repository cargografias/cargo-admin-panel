require('dotenv').load();  //This goes first in case any of the required libraries make use of an environment var

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();


var redis = require('redis');
var redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST); // replace with your config

redisClient.on('connect', function(){
  console.log('Connected to Redis: ' + process.env.REDIS_PORT + ":" + process.env.REDIS_HOST);
});

redisClient.on('error', function(err) {
     console.log('Redis error: ' + err);
}); 



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

var sessionOptions = {
  secret: process.env.COOKIE_SECRET,
  resave: false, 
  saveUninitialized: false,
  cookie: {}
};

// if (app.get('env') === 'production') {
//   app.set('trust proxy', 1) // trust first proxy
//   sessionOptions.cookie.secure = true // serve secure cookies
//   sessionOptions.proxy = true;
// }

// if (app.get('env') === 'development') {
//     //Here configure session to disk
//     var FileStore = require('session-file-store')(session);
//     sessionOptions.store = new FileStore({})
// } else if( app.get('env') === 'production'){
// }

  var RedisStore = require('connect-redis')(session);
  sessionOptions.store = new RedisStore({
    client: redisClient
  })


app.use(session(sessionOptions));

//No routing before this line
app.use(express.static(path.join(__dirname, 'public')));

//Check https:
// if (app.get('env') === 'production') {
//     app.use(function(req, res, next){
//         if(req.headers['x-forwarded-proto']!='https'){
//             res.redirect('https://' + process.env.BASE_URL +req.url);
//         }
//         else{
//             next();
//         }
//     });
// }

require('./routes').init(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
