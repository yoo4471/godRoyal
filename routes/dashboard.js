var express = require('express');
var MovieContents = require('../models/movieSchema');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('dashboard');
});

router.get('/movielist', function(req, res, next) {
  res.render('dashboard/data_table');
});

router.get('/form', function(req, res, next) {
  res.render('flatUI/form');
});

router.get('/test', function(req, res, next) {
  var request = require("request");
  var url = "http://localhost:3000/json/movie.json";

  request({
      url: url,
      json: true
  }, function (error, response, body) {

      if (!error && response.statusCode === 200) {
          var a = body["data"][0]['title_kor']
          // var a = body.replace("\n", "")
          res.json(a);

          console.log() // Print the json response
      }

  });


});

router.get('/insert_movie', function(req, res, next) {
  var request = require("request");
  var url = "http://localhost:3000/json/movie.json";

  request({
      url: url,
      json: true
  }, function (error, response, body) {

      if (!error && response.statusCode === 200) {
          var a = body["data"]

          for (var i=0; i<a.length; i++) {
            var newMovieContents = new MovieContents;

            newMovieContents.title_kor = a[i]["title_kor"];
            newMovieContents.title_eng = a[i]["title_eng"];
            newMovieContents.nation = a[i]["nation"];
            newMovieContents.release_date = a[i]["release_date"];
            newMovieContents.run_time = a[i]["run_time"];
            newMovieContents.grade = a[i]["grade"];
            newMovieContents.director = a[i]["director"];
            newMovieContents.actors = a[i]["actors"];
            newMovieContents.description_title = a[i]["description_title"];
            newMovieContents.description = a[i]["description"];
            newMovieContents.current = a[i]["current"];
            newMovieContents.img_url = a[i]["img_url"];
            newMovieContents.rating = a[i]['rating'];

            newMovieContents.save(function (err)  {
              if (err) throw err;
              console.log('success join')
            });
          }
          // var a = body.replace("\n", "")
          res.json(a);


      }

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
