var express = require('express');
var MovieContents = require('../models/movieSchema');
var UserContents = require('../models/userSchema');
var ScreenContents = require('../models/screenSchema');
var cookieSession = require('cookie-session')
var router = express.Router();

router.use(cookieSession({
  name: 'session',
  keys: ['A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))


router.get('/', function(req, res, next) {
  res.redirect('/dashboard/1')
});
router.get('/1', function(req, res, next) {
  res.render('dashboard');
});

router.get('/2', function(req, res, next) {
  res.render('dashboard2');
});

router.get('/movielist', function(req, res, next) {
  res.render('data_table');
});

router.get('/screenlist', function(req, res, next) {
  res.render('screen_data');
});

router.get('/write', function(req, res, next) {
  res.render('movie_write');
});


router.get('/screen_write', function(req, res, next) {
  res.render('screen_write');
});
router.get('/screen_update:_id', function(req, res, next) {
  var _id = req.params._id;
  console.log(_id)
  ScreenContents.findOne({}, function(err, screenContents){

    if(err) return res.status(500).send({error: 'database failure'});
    console.log(screenContents)
    res.render('movie_update', {row: screenContents});

  });
});
router.get('/form', function(req, res, next) {
  res.render('flatUI/form');
});

router.get('/test', function(req, res, next) {

  RateContents.find({}, {'_id':false, '__v':false}, function(err, rateContents){
    if(err) return res.status(500).send({error: 'database failure'});

    console.log(rateContents)

  });
});






router.get('/movielist/:_id',function(req, res, next) {
  var _id = req.params._id;
  console.log(_id)
  MovieContents.findOne({_id:_id}, function(err, movieContents){

    if(err) return res.status(500).send({error: 'database failure'});
    console.log(movieContents)
    res.render('dashboard/update', {row: movieContents});

  });
});

router.get('/update_movie/:_id',function(req, res, next) {
  var _id = req.params._id;
  MovieContents.findOne({_id:_id}, function(err, movieContents){
    if(err) return res.status(500).send({error: 'database failure'});
    console.log(movieContents)
    res.render('movie_update', {row: movieContents});

  });
});

router.get('/update_screen/:_id',function(req, res, next) {
  var _id = req.params._id;
  ScreenContents.findOne({_id:_id}, function(err, screenContents){
    if(err) return res.status(500).send({error: 'database failure'});
    res.render('screen_update', {row: screenContents});

  });
});

/* GET users listing. */
router.get('/movie',function(req, res, next) {

  MovieContents.find(function(err, movieContents){
      if(err) return res.status(500).send({error: 'database failure'});

      var data = []
      var current = ""
      for (i = 0; i < movieContents.length; i++) {
        if (movieContents[i]['current'] == "1") { current = "상영중"}
        else current = ""
        movielist = [movieContents[i]['title_kor'], movieContents[i]['title_eng'], movieContents[i]['nation'],
        movieContents[i]['director'], movieContents[i]['release_date'], current, movieContents[i]['_id']]
        data.push(movielist)


      }
      console.log(data)

      var a = {"data" : data}
      res.json(a);
  })



});

/* GET users listing. */
router.get('/screen',function(req, res, next) {

  ScreenContents.find(function(err, screenContents){
      if(err) return res.status(500).send({error: 'database failure'});
      console.log(screenContents)
      var data = []
      // { _id: 80230,
      //     date: '2017년 6월 2일',
      //     start_time: '2200',
      //     title_eng: 'Guardians of the Galaxy Vol. 2',
      //     room: '7관',
      //     screen_num: '4',
      //     state: '서울',
      //     theater: '강남 GRL',
      //     __v: 0,
      //     seat: [ [Object] ] },
      for (i = 0; i < screenContents.length; i++) {
        screenlist = [screenContents[i]['title_eng'], screenContents[i]['state'], screenContents[i]['theater'],
        screenContents[i]['room'], screenContents[i]['screen_num'], screenContents[i]['date'], screenContents[i]['_id']]
        data.push(screenlist)


      }


      var a = {"data" : data}
      res.json(a);
  })



});


router.post('/movielist/enrollment',function(req,res,next){

  console.log(req.body);
  // creates DB schema

  // compiels our schema into a model
  // var User = mongoose.model('User', boardSchema);

  var newMovieContents = new MovieContents;

  newMovieContents.title_kor = req.body.title_kor;
  newMovieContents.title_eng = req.body.title_eng;
  newMovieContents.nation = req.body.nation;
  newMovieContents.relese_date = req.body.relese_date;
  newMovieContents.run_time = req.body.run_time;
  newMovieContents.grade = req.body.grade;
  newMovieContents.director = req.body.director;
  newMovieContents.actors = req.body.actors;
  newMovieContents.description_title = req.body.description_title;
  newMovieContents.description = req.body.description;
  newMovieContents.current = req.body.current;
  newMovieContents.poster_img_url = req.body.poster_img_url;
  newMovieContents.wide_img_url = req.body.wide_img_url;
  newMovieContents.slide_img_url.push(req.body.slide_img_url1)
  newMovieContents.slide_img_url.push(req.body.slide_img_url2)
  newMovieContents.slide_img_url.push(req.body.slide_img_url3)
  newMovieContents.slide_img_url.push(req.body.slide_img_url4)
  newMovieContents.youtube = req.body.youtube

  // for (var i = 0; i < req.body.genre.length; i++) {
  //   newMovieContents.genre.push(req.body.genre[i])
  // }

  newMovieContents.save(function (err)  {
    if (err) throw err;
    console.log('success join')
  });
  // creates DB schema

  // compiels our schema into a model
  // var User = mongoose.model('User', boardSchema);


  res.redirect('/dashboard/movielist')
});

router.post('/screenlist/enrollment',function(req,res,next){


  // creates DB schema
  var a = req.body.state_theater
  var b = a.split(',')
  var newScreenContents = new ScreenContents;


  newScreenContents.title_eng = req.body.title_eng;
  newScreenContents.state = b[0];
  newScreenContents.theater = b[1];
  newScreenContents.room = req.body.room;
  newScreenContents.date = req.body.date;
  newScreenContents.start_time = req.body.start_time;
  newScreenContents.screen_num = req.body.screen_num;




  newScreenContents.save(function (err)  {
    if (err) throw err;
    console.log('success join')
  });
  // creates DB schema

  // compiels our schema into a model
  // var User = mongoose.model('User', boardSchema);


  res.redirect('/dashboard/screenlist')
});



module.exports = router;
