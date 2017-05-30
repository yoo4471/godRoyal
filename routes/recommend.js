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

  var request = require("request");
  var url = "http://localhost:3000/json/rate.json";

  request({
      url: url,
      json: true
  }, function (error, response, body) {

      if (!error && response.statusCode === 200) {
          var a = body["rate"]


          for (var i=0; i<a.length; i++) {
            var thing = a[i]['thing']
            var action = a[i]['action']
            var person = a[i]['person']
            console.log(thing, action, person)
            router.insert_db_rates(person, thing, action);
            if(action =='likes') {
              MovieContents.findOneAndUpdate( { "title_eng": thing } , { "$push": { 'likes' : person}}).exec(function(err, movieContents){

                // console.log(movieContents)
                 if(err) return res.status(500).send({error: 'database failure'});
              });
            }
            else {
              MovieContents.findOneAndUpdate( { "title_eng": thing } , { "$push": { 'dislikes' : person}}).exec(function(err, movieContents){
                // console.log(movieContents)
                 if(err) return res.status(500).send({error: 'database failure'});
              });
            }


          }

          callback('init rate is done')
      }

  });
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
            newMovieContents.poster_img_url = a[i]["poster_img_url"];
            newMovieContents.wide_img_url = a[i]["wide_img_url"];
            newMovieContents.rating = a[i]['rating'];

            for (var j = 0; j < a[i]['comment'].length; j++) {
              newMovieContents.comment.push(a[i]['comment'][j])
            }

            for (var j = 0; j < a[i]['genre'].length; j++) {
              newMovieContents.genre.push(a[i]['genre'][j])
            }
            for (var j = 0; j < a[i]['slide_img_url'].length; j++) {
              newMovieContents.slide_img_url.push(a[i]['slide_img_url'][j])
            }


            newMovieContents.save(function (err)  {
              if (err) throw err;
              // console.log('success join')
            });
          }

          callback('init movie is done')
      }

  });

}
router.movies = function(MovieItems, callback) {
    var lookup = 0;
    var subOrderList = []
    // console.log(MovieItems)
    MovieItems.forEach(function(movieItem) {

        MovieContents.findOne({ 'title_eng' : movieItem.thing }).lean().exec(function (err, thing) {




            subOrderList.push(thing);

            if (++lookup == MovieItems.length) callback(subOrderList);
        });
    });
}

router.test = function(email) {
  RateContents.find({person:email},function(err, rateContents){
      if(err) return res.status(500).send({error: 'database failure'});
      return rateContents;
  })
}
module.exports = router;
