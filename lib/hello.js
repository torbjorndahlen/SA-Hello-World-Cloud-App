var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var fh = require('fh-mbaas-api');

 var counter = 'my_counter';
var timer_name = 'my_timer';

function helloRoute() {
  var hello = new express.Router();
  hello.use(cors());
  hello.use(bodyParser());


  // GET REST endpoint - query params may or may not be populated
  hello.get('/', function(req, res) {
    console.log(new Date(), 'In hello route GET / req.query=', req.query);
    var world = req.query && req.query.hello ? req.query.hello : 'World';

    fh.stats.inc(counter);

    var start_time = new Date().getTime();
    var timer_name = "my_timer";

  fh.service({
    "guid": "kn5dnube24ho5vf6fomj6uun",
    "path": "/barcode/read",
    "method": "POST",
    "headers": {
      "Content-Type" : "application/json"
    },
    "params": {
    "barcode": "9780201896831"
  }
  }, function(err, body, res1) {
    console.log('statuscode: ', res1 && res1.statusCode);

    if ( err ) {
      // An error occurred during the call to the service. log some debugging information
      console.log('service call failed - err : ', err);
    } else {
      console.log('Got response from service - status body : ', res1.statusCode, body);
      fh.stats.timing(timer_name, new Date().getTime() - start_time);

      // Store productname in MongoDB
              var options = {
                  "act": "create",
                  "type": "Product",
                  "fields": {
                      "productname": body[0].productname,
                      "imageurl": body[0].imageurl,
                      "price": body[0].price
                  }
              };

              fh.db(options, function (err, data) {
                  if (err) {
                      console.error("Error " + err);
                  } else {
                      console.log(JSON.stringify(data));
                  }
              });


       res.json(body);
    }
});

});

  // POST REST endpoint - note we use 'body-parser' middleware above to parse the request body in this route.
  // This can also be added in application.js
  // See: https://github.com/senchalabs/connect#middleware for a list of Express 4 middleware
  hello.post('/', function(req, res) {
    console.log(new Date(), 'In hello route POST / req.body=', req.body);
    var world = req.body && req.body.hello ? req.body.hello : 'World';

    // see http://expressjs.com/4x/api.html#res.json
    res.json({msg: 'Hello ' + world});
  });

  return hello;
}

module.exports = helloRoute;
