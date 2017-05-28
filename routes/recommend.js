var express = require('express');
var MovieContents = require('../models/movieSchema');
var UserContents = require('../models/userSchema');
var RateContents = require('../models/rateSchema');
var cookieSession = require('cookie-session')
var router = express.Router();


router.use(cookieSession({
  name: 'session',
  keys: ['A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

router.insert_db_rates = function(user, title, action) {

  var newRateContents = new RateContents;
  newRateContents.person = user
  newRateContents.thing = title
  newRateContents.action = action
  newRateContents.save(function (err)  {
    if (err) throw err;
    // console.log(user + ' : ' + title + ' ' + action)
  });
}

router.init_db_rates = function (callback) {

  var user = ['A', 'B', 'C', 'D'];
  var action = ''
  console.log("rate 초기화 완료")
  MovieContents.find(function(err, movieContents){
      if(err) return res.status(500).send({error: 'database failure'});


      for (i = 0; i < movieContents.length; i++) {


        for (j = 0; j < 4; j++) {
          var rannum = Math.floor(Math.random() * 3);

          if (rannum == 1) {
            action ='likes';
            router.insert_db_rates(user[j], movieContents[i]['title_eng'], action);
            MovieContents.findOneAndUpdate({ "title_eng": movieContents[i]['title_eng'] }, { "$push": { "likes": user[j]}}).exec(function(err, movieContents){
               if(err) return res.status(500).send({error: 'database failure'});
            });
          }
          else if(rannum == 2){
            action = 'dislikes';
            router.insert_db_rates(user[j], movieContents[i]['title_eng'], action);
            MovieContents.findOneAndUpdate({ "title_eng": movieContents[i]['title_eng'] }, { "$push": { "dislikes": user[j]}}).exec(function(err, movieContents){
               if(err) return res.status(500).send({error: 'database failure'});
            });
          }
          else {
            
          }



        }


      }
      callback('init rates is done')
  })
}



router.init_db_movies = function(callback) {
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
              // console.log('success join')
            });
          }

          callback('init movie is done')
      }

  });

}

router.test = function(email) {
  RateContents.find({person:email},function(err, rateContents){
      if(err) return res.status(500).send({error: 'database failure'});
      return rateContents;
  })
}
module.exports = router;
