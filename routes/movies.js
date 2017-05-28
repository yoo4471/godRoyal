var express = require('express');
var MovieContents = require('../models/movieSchema');
var UserContents = require('../models/userSchema');
var RateContents = require('../models/rateSchema');
var cookieSession = require('cookie-session')
var recommend = require('./recommend')
var router = express.Router();

var g = require('ger')
// Create an Event Store Manager (ESM) that stores events and provides functions to query them
var esm = new g.MemESM()
// Initialize GER with the esm
var ger = new g.GER(esm);
ger.initialize_namespace('movies');

router.use(cookieSession({
  name: 'session',
  keys: ['A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))



/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/movies/boxoffice');
});//get



/* GET home page. */
router.get('/boxoffice', function(req, res, next) {
  MovieContents.find({current:1}, function(err, boardContents){

  if(err) return res.status(500).send({error: 'database failure'});

  // console.log(boardContents[0].img_url);
  // res.render('update', {title:"글 수정", error:"", row: boardContents});

  res.render('boxoffice', {
      rows: boardContents,
      email: req.session.email
      }
    );
  });
});//get




router.get('/init1', function(req, res, next) {
  MovieContents.remove({}, function(err) {
     console.log('collection moviecontents removed')
  });
  recommend.init_db_movies(function(response){
    // Here you have access to your variable
    res.send(response);

  })
});

router.get('/init2', function(req, res, next) {
  RateContents.remove({}, function(err) {
     console.log('collection ratecontents removed')
  });
  recommend.init_db_rates(function(response){
    // Here you have access to your variable

    res.send(response);
  })
});

router.get('/init3', function(req, res, next) {
  RateContents.find({}, {'_id':false, '__v':false}, function(err, rateContents){
    if(err) return res.status(500).send({error: 'database failure'});

    user = ['A', 'B', 'C', 'D'];
    var rannum = Math.floor(Math.random() * 4);
    console.log(user[rannum])

    ger.events(rateContents);
    ger.recommendations_for_person('movies', user[rannum], {actions: {likes: 1}, filter_previous_actions:['likes']})
    .then( function(recommendations) {
      console.log("\nRecommendations For " + user[rannum])
      console.log(JSON.stringify(recommendations,null,2))
      res.json(recommendations,null,2)
    })

  });
});

/* GET home page. */
router.get('/show1', function(req, res, next) {
  MovieContents.find(function(err, boardContents){

  if(err) return res.status(500).send({error: 'database failure'});

  // console.log(boardContents[0].img_url);
  // res.render('update', {title:"글 수정", error:"", row: boardContents});
    res.json(boardContents);
  });
});//get

/* GET home page. */
router.get('/show2', function(req, res, next) {
  RateContents.find(function(err, boardContents){

  if(err) return res.status(500).send({error: 'database failure'});

  // console.log(boardContents[0].img_url);
  // res.render('update', {title:"글 수정", error:"", row: boardContents});
    res.json(boardContents);
  });
});//get

router.get('/show3', function(req, res, next) {
  MovieContents.find({current:"1"},function(err, movieContents){
      if(err) return res.status(500).send({error: 'database failure'});

      RateContents.find({person:'A', action:'likes'},function(err, rateContents){
          if(err) return res.status(500).send({error: 'database failure'});
          res.json(movieContents)

      })
  })


});//get

module.exports = router;
