// Takes care of updating the picture to cloudinary after the item has been saved

var Q = require('q');
var request = require('request');
var crypto = require('crypto');
var fs = require('fs');
var PopitToolkit = require('popit-toolkit');

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

function cloudConvertAndDownloadToServer(instanceName, personId, photoUrl) {
  return Q.Promise(function(resolve, reject, notify) {
    try {
      var cloudinaryBase = 'http://res.cloudinary.com/cargografias/image/fetch/h_200,w_200,c_thumb,g_face,f_jpg/'
      var imgToDownload = cloudinaryBase + photoUrl;
      var dstPath = process.env.IMAGES_STATIC_PATH + '/' + instanceName;
      var dstName = personId + ".jpg";

      if (!fs.existsSync(dstPath)) {
        fs.mkdirSync(dstPath)
      }
      request.get(imgToDownload)
        .on('error', function(err) {
          console.log("Error getting file", imgToDownload);
          reject(err);
        })
        .pipe(fs.createWriteStream(dstPath + '/' + dstName))
      console.log('image created', process.env.IMAGES_STATIC_BASE_URL + "/" + instanceName + '/' + dstName)
      resolve({
        url: process.env.IMAGES_STATIC_BASE_URL + "/" + instanceName + '/' + dstName
      });
    } catch (ex) {
      console.log(ex);
      reject(ex);
    }
  })
}

function createCloudinaryImageForPerson(person, popitInfo) {
  return Q.Promise(function(resolve, reject, notify) {

    cloudConvertAndDownloadToServer(popitInfo.instanceName, person.id, person.image)
      .then(function(result) {

        person.image_original = person.image;
        person.image = result.url;
        delete person.images;
        console.log('updating image for person', person.name, result.url);
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
    var dateRE = /^[0-9]{4}(-[0-9]{2}){0,2}$/;

    if (typeof person.birth_date !== 'undefined' && !dateRE.test(person.birth_date)) {
      delete person.birth_date
    }

    if (typeof person.death_date !== 'undefined' && !dateRE.test(person.death_date)) {
      delete person.death_date
    }

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

function getPersonFromPopit(personId, popitInfo) {
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

function updatePersonImage(person, popitInfo) {
  var localImage = new RegExp("^" + process.env.IMAGES_STATIC_BASE_URL)
  return Q.promise(function(resolve, reject, notify) {
    if (person.image && !localImage.test(person.image)) {
      console.log('updating', person.name)
      createCloudinaryImageForPerson(person, popitInfo).then(function(result) {
        resolve();
      }).catch(function(err) {
        reject(err);
      })
    }
  });
}

function updateCloudinaryImage(personId, popitInfo) {
  // popitInfo: { instanceName : '' , apikey : '' }

  getPersonFromPopit(personId, popitInfo).then(function(person) {
      updatePersonImage(person, popitInfo)
        .then(function() {

        })
        .catch(function(err) {
          console.log('error updating picture', err)
        })
    })
    .catch(function(err) {
      console.log("ERROR", err)
    })

}

function updateAllPictures(popitInfo) {

  var toolkit = PopitToolkit({
    host: popitInfo.instanceName + ".popit.mysociety.org",
    Apikey: popitInfo.apikey
  });

  console.log("loading persons");
  toolkit.loadAllItems('persons').then(function(persons) {
    persons.forEach(function(person) {
      updatePersonImage(person, popitInfo);
    })
  }, function(err) {
    console.log('error getting persons', err);
    reject();
  });

}

module.exports = {
  updateCloudinaryImage: updateCloudinaryImage,
  updateAllPictures: updateAllPictures
};