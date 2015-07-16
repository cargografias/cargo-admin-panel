// Takes care of updating the picture to cloudinary after the item has been saved

var Q = require('q');
var request = require('request');
var crypto = require('crypto');

function cloudPost(public_id, photoUrl, cloudinaryInfo) {

  return Q.Promise(function(resolve, reject, notify) {

    var unixTimeInSeconds = Math.floor(Date.now() / 1000);
    var apikey = cloudinaryInfo.apikey
    var secret = cloudinaryInfo.secret

    // These are the values tha need to be signed:
    // callback, eager, format, public_id, tags, timestamp, transformation, type
    // Anything else should be added later, after calculating the signature.
    // http://cloudinary.com/documentation/upload_images#request_authentication

    var params = {
      timestamp: unixTimeInSeconds,
      format: "jpg",
      transformation: "w_200,h_200,c_thumb,g_face",
      public_id: public_id
    }

    var signItems = []
    Object.keys(params).sort().forEach(function(key) {
      signItems.push(key + '=' + params[key])
    })
    var signString = signItems.join('&') + secret;
    var signature = crypto.createHash('sha1').update(signString).digest('hex')

    //not signing params:
    params.file = photoUrl;
    params.signature = signature;
    params.api_key = apikey;

    var reqOpts = {
      method: "POST",
      url: cloudinaryInfo.uploadurl,
      json: true,
      body: params
    };

    request(reqOpts, function(err, response, body) {
      if (err) {
        reject({
          err: err,
          response: response,
          body: body
        })
      } else {
        if (body.error) {
          reject({
            err: body.error,
            body: body
          })
        } else {
          resolve(body)
        }
      }
    })

  });

}

function createCloudinaryImageForPerson(person, popitInfo, cloudinaryInfo) {
  return Q.Promise(function(resolve, reject, notify) {
    var public_id = popitInfo.instanceName + "/" + person.id;
    cloudPost(public_id, person.image, cloudinaryInfo)
      .then(function(result) {

        person.image_original = person.image;
        person.image = result.secure_url;
        delete person.images;

        updatePerson(person, popitInfo)
          .then(function(result) {
            resolve(result)
          })
          .catch(function(err) {
            console.log("error updating person", person, err)
            reject({
              message: "error updating person",
              person: person,
              err: err
            });
          })

      })
      .catch(function(err) {
        console.log("error creating cloudinary", person, err)
        reject({
          message: "error creating cloudinary",
          person: person,
          err: err
        });
      });
  });
}


function updatePerson(person, popitInfo) {

  return Q.promise(function(resolve, reject, notify) {

    var url = "https://" + popitInfo.instanceName + ".popit.mysociety.org/api/v0.1/persons/" + person.id;

    var options = {
      url: url,
      method: 'PUT',
      body: person,
      json: true,
      headers: {
        'Apikey': popitInfo.apikey
      }
    }

    request(options, function(err, httpResponse, body) {
      if (err) {
        console.log(err)
        reject(err);
      } else {
        resolve(body);
      }
    })

  });
}

function getPersonFromPopit(personId, popitInfo){
	return Q.promise(function(resolve, reject, notify) {

	    var url = "https://" + popitInfo.instanceName + ".popit.mysociety.org/api/v0.1/persons/" + personId + "?embed=";

	    var options = {
	      url: url,
	      method: 'GET',
	      headers: {
	        'Apikey': popitInfo.apikey
	      }
	    }

	    request(options, function(err, httpResponse, body) {
	      if (err) {
	        console.log(err)
	        reject(err);
	      } else {
	        resolve(JSON.parse(body).result);
	      }
	    })

	});
}


function updateCloudinaryImage(personId, popitInfo, cloudinaryInfo){
	// popitInfo: { instanceName : '' , apikey : '' }
	// cloudinaryInfo: { apikey : '' , uploadurl : '' , secret }
	
	var cloudRE = /^(?:http\:|https\:|)\/\/res\.cloudinary\.com/

	getPersonFromPopit(personId, popitInfo).then(function(person){
		if (person.image && !cloudRE.test(person.image)) {
			createCloudinaryImageForPerson(person, popitInfo, cloudinaryInfo).then(function(result){
				//
			}).catch(function(err){
				console.log('error updating picture')
			})			
		}	})
	.catch(function(err){
		console.log("ERROR", err)
	})

}

module.exports = {
	updateCloudinaryImage: updateCloudinaryImage
};