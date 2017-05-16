var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('dashboard');
});

router.get('/movielist', function(req, res, next) {
  res.render('partials/data_table');
});

router.get('/form', function(req, res, next) {
  res.render('flatUI/form');
});
module.exports = router;
