var express = require('express');
var MovieContents = require('../models/movieSchema');
var cookieSession = require('cookie-session')
var router = express.Router();

router.use(cookieSession({
  name: 'session',
  keys: ['A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

/* GET home page. */
router.get('/', function(req, res, next) {
  MovieContents.find({current:1}, function(err, boardContents){

  if(err) return res.status(500).send({error: 'database failure'});

  // console.log(boardContents[0].img_url);
  // res.render('update', {title:"글 수정", error:"", row: boardContents});

  res.render('index', {rows: boardContents});
  });
});

router.get('/login', function(req, res, next) {
  console.log(req.session.user_id)
  res.render('login');
});

router.post('/login', function(req, res, next) {
  var id = req.body.id;
  var passwd = req.body.passwd
  req.session.user_id = id
  res.send(id+passwd)
});

router.get('/logout', function(req, res, next) {
  req.session.destory();  // 세션 삭제
  res.clearCookie('godRoyal'); // 세션 쿠키 삭제
  res.redirect('/');
});

router.get('/NewMovies', function(req, res, next) {
  MovieContents.find({current:1}, function(err, boardContents){

  if(err) return res.status(500).send({error: 'database failure'});

  // console.log(boardContents[0].img_url);
  // res.render('update', {title:"글 수정", error:"", row: boardContents});

  res.render('NewMovies', {rows: boardContents});
  });
});

router.get('/OldMovies', function(req, res, next) {
  MovieContents.find({current:1}, function(err, boardContents){

  if(err) return res.status(500).send({error: 'database failure'});

  // console.log(boardContents[0].img_url);
  // res.render('update', {title:"글 수정", error:"", row: boardContents});

  res.render('OldMovies', {rows: boardContents});
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
            newMovieContents.genre = a[i]["genre"];
            newMovieContents.release_date = a[i]["release_date"];
            newMovieContents.run_time = a[i]["run_time"];
            newMovieContents.grade = a[i]["grade"];
            newMovieContents.director = a[i]["director"];
            newMovieContents.actors = a[i]["actors"];
            newMovieContents.description_title = a[i]["description_title"];
            newMovieContents.description = a[i]["description"];
            newMovieContents.current = a[i]["current"];
            newMovieContents.img_url = a[i]["img_url"];


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










module.exports = router;
