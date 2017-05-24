var express = require('express');
var MovieContents = require('../models/movieSchema');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  MovieContents.find({current:1}, function(err, movieContents){

  if(err) return res.status(500).send({error: 'database failure'});
    console.log(movieContents)
  // console.log(boardContents[0].img_url);
  // res.render('update', {title:"글 수정", error:"", row: boardContents});

  res.render('index', {rows: movieContents});
  });
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

router.get('/ydw',function(req, res, next) {


    MovieContents.find({current:1}, function(err, boardContents){

    if(err) return res.status(500).send({error: 'database failure'});

    // console.log(boardContents[0].img_url);
    // res.render('update', {title:"글 수정", error:"", row: boardContents});

    res.render('index', {rows: boardContents});
    });
});

router.get('/iframe_TopSlide', function(req, res, next) {
  res.render('partials/TopSlide');
});
router.get('/iframe_Movie-Detail', function(req, res, next) {
  res.render('partials/Movie-Detail');
});
module.exports = router;
