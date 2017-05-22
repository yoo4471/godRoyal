var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/movies', function(req, res, next) {
  res.render('movies');
});

router.get('/Movie-Detail', function(req, res, next) {
  res.render('Movie-Detail');
});

router.get('/test', function(req, res, next) {
  res.render('test');
});

router.get('/cards', function(req, res, next) {
  res.render('cards');
});


router.get('/iframe_TopSlide', function(req, res, next) {
  res.render('partials/TopSlide');
});
module.exports = router;
