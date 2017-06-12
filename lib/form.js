var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var fh = require('fh-mbaas-api');

function formRoute() {
  var formRouter = new express.Router();
  formRouter.use(cors());
  formRouter.use(bodyParser());

  formRouter.get('/', function(req, res) {
    console.log(new Date(), 'In form route GET /');

  fh.forms.getForms(
    {
    },
    function (err, response) {
      if (err) {
        console.log("Error: " + err);
        res.statusCode = 404;
        res.send('Not found');
      } else {
        console.log(JSON.stringify(response));
        res.statusCode = 200;
        res.json(response);
      }
  });

  });


  formRouter.get('/:formId', function(req, res) {
    console.log(new Date(), 'In form route GET / req.params.formId=', req.params.formId);

  fh.forms.getForm(
    {
      "_id":req.params.formId.substring(1)
    },
    function (err, response) {
      if (err) {
        console.log("Error: " + err);
        res.statusCode = 404;
        res.send('Form could not be found');
      } else {
        console.log(JSON.stringify(response));
        res.statusCode = 200;
        res.json(response);
      }
  });

  });

  return formRouter;
}

module.exports = formRoute;
