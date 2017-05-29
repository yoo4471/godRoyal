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
router.get('/test', function(req, res, next) {

  var request = require("request");
  var url = "http://localhost:3000/json/rate.json";

  request({
      url: url,
      json: true
  }, function (error, response, body) {

      if (!error && response.statusCode === 200) {
          var a = body["Rate"]
          res.json(a)




      }

  });
});//get


/* GET home page. */
router.get('/boxoffice', function(req, res, next) {
  MovieContents.find({ current:1 }, function(err, movieContents){

  if(err) return res.status(500).send({error: 'database failure'});
  orderContents = movieContents.slice();
  orderContents.sort(function (a, b) {
    return b.likes.length - a.likes.length;
  });

  res.render('boxoffice', {
      rows: movieContents,
      rows_order: orderContents,
      email: req.session.email

      }
    );
  });
});//get

/* GET home page. */
router.get('/recommend', function(req, res, next) {
  if (req.session.email) {
    RateContents.find({}, {'_id':false, '__v':false}, function(err, rateContents){
      if(err) return res.status(500).send({error: 'database failure'});



      ger.events(rateContents);
      ger.recommendations_for_person('movies', req.session.email, {actions: {likes: 1}, filter_previous_actions:['likes']})
      .then( function(recommendations) {

        var recomm_list = []
        console.log("\nRecommendations For " + req.session.email)
        console.log(JSON.stringify(recommendations,null,2))
        recommend.movies(recommendations['recommendations'], (function(response){
          for (var i = 0; i < recommendations['recommendations'].length; i++) {
            recomm_list.push(recommendations['recommendations'][i]['thing'])
          }

          response.sort(function(a,b){
            return recomm_list.indexOf(a.title_eng) < recomm_list.indexOf(b.title_eng) ? -1 : 1;
          });
          console.log(recommendations['recommendations'])
          res.render('recommend', {
              rows: response,
              rows_recomm: recommendations['recommendations'],
              email: req.session.email

              }
            );//res
        }))//end_recommed

      })//then`

    });//RateContents.find

  }//endif
  else {
    res.redirect('/login')
  }//endelse

});//get

router.post('/update/rating_bad', function(req, res, next) {

  console.log(req.body)
  if (req.body.status == 1) {
    MovieContents.findOneAndUpdate({ "title_eng": req.body.title_eng}, { "$pop": { "likes": req.body.email} , "$push": { "dislikes": req.body.email} } ).exec(function(err, rateContents){
       if(err) return res.status(500).send({error: 'database failure'});
       RateContents.findOneAndUpdate({ "thing": req.body.title_eng, "person": req.body.email}, { "$set": { "action": 'dislikes'}}).exec(function(err, rateContents){
          if(err) return res.status(500).send({error: 'database failure'});
          res.redirect('/movies')
       });
    });

  }
  else {
    MovieContents.findOneAndUpdate({ "title_eng": req.body.title_eng}, {"$push": { "dislikes": req.body.email} } ).exec(function(err, rateContents){
       if(err) return res.status(500).send({error: 'database failure'});
       recommend.insert_db_rates(req.body.email, req.body.title_eng, 'dislikes')
       res.redirect('/movies')
    });
  }


});//get

router.post('/update/rating_good', function(req, res, next) {

  console.log(req.body)
  if (req.body.status == 1) {
    MovieContents.findOneAndUpdate({ "title_eng": req.body.title_eng}, { "$pop": { "dislikes": req.body.email} , "$push": { "likes": req.body.email} } ).exec(function(err, rateContents){
       if(err) return res.status(500).send({error: 'database failure'});
       RateContents.findOneAndUpdate({ "thing": req.body.title_eng, "person": req.body.email}, { "$set": { "action": 'likes'}}).exec(function(err, rateContents){
          if(err) return res.status(500).send({error: 'database failure'});
          res.redirect('/movies')
       });
    });

  }
  else {
    MovieContents.findOneAndUpdate({ "title_eng": req.body.title_eng}, {"$push": { "likes": req.body.email} } ).exec(function(err, rateContents){
       if(err) return res.status(500).send({error: 'database failure'});
       recommend.insert_db_rates(req.body.email, req.body.title_eng, 'likes')
       res.redirect('/movies')
    });
  }


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



    ger.events(rateContents);
    ger.recommendations_for_person('movies', 'alphago', {actions: {likes: 1}, filter_previous_actions:['likes']})
    .then( function(recommendations) {
      console.log("\nRecommendations For " + 'alphago')
      console.log(JSON.stringify(recommendations,null,2))
      res.json(recommendations['recommendations'],null,2)
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
  MovieContents.find({current:"1"},{},function(err, movieContents){
      if(err) return res.status(500).send({error: 'database failure'});
      a = movieContents.slice();
      a.sort(function (a, b) {
        return b.likes.length - a.likes.length;
      });

      res.json(movieContents)

  })


});//get

module.exports = router;
