var express = require('express');
var router = express.Router();

var ping = function (req, res, next) {
  console.log('ping');
  return next();
};

var pong = function (req, res, next) {
  console.log('pong');
  return next();
};

/* GET home page. */
router.get('/', ping, pong, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
