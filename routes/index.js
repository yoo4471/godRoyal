var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/test', function(req, res, next) {
  res.render('test');
});

router.get('/cards', function(req, res, next) {
  res.render('cards');
});
module.exports = router;
