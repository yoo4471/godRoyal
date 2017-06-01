var express = require('express');
var MovieContents = require('../models/movieSchema');
var UserContents = require('../models/userSchema');
var cookieSession = require('cookie-session')
var router = express.Router();

router.use(cookieSession({
  name: 'session',
  keys: ['A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))


router.get('/', function(req, res, next) {
  res.render('dashboard');
});

router.get('/movielist', function(req, res, next) {
  res.render('data_table');
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






router.get('/movielist/update/:_id',function(req, res, next) {
  var _id = req.params._id;
  console.log(_id)
  MovieContents.findOne({_id:_id}, function(err, movieContents){

    if(err) return res.status(500).send({error: 'database failure'});
    console.log(movieContents)
    res.render('dashboard/movielist/update', {row: movieContents});

  });
});


/* GET users listing. */
router.get('/all',function(req, res, next) {

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


  newMovieContents.save(function (err)  {
    if (err) throw err;
    console.log('success join')
  });
  // creates DB schema

  // compiels our schema into a model
  // var User = mongoose.model('User', boardSchema);


  res.json(req.body);
});



module.exports = router;
