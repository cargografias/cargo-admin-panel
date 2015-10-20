// Creates default admin user (pwd admin)

var db = require('./db');

var crypto = require('crypto');

var CI = new db.CargoInstance({
        instanceName: 'cargografias', 
        popitUrl: 'cargografias.popit.mysociety.org', 
        popitApiKey: '', 
        status: '', 
        username: 'admin', 
        email: 'admin@cargografias.org', 
      password: crypto.createHash('sha1').update('admin').digest('hex'),
      emailHash: crypto.createHash('md5').update('admin@cargografias.org').digest('hex'),
        isAdmin: true
}).save(function(err, res){
    if(err){console.log('error', err)}else{
        console.log( 'ok', res)
    }
})

