var express = require('express');
var MovieContents = require('../models/movieSchema');
var UserContents = require('../models/userSchema');
var RateContents = require('../models/rateSchema');
var ScreenContents = require('../models/screenSchema');
var ReserveContents = require('../models/reserveSchema');
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

          callback('================================================\n================init rate is done================\n================================================')
      }

  });
}





router.init_db_movies = function(callback) {
  MovieContents.remove({}, function(err) {
    ScreenContents.remove({}, function(err) {
      UserContents.remove({}, function(err) {
        RateContents.remove({}, function(err) {
          ReserveContents.remove({}, function(err) {
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
                      newMovieContents.youtube = a[i]['youtube'];

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
                            var request = require("request");
                            var url = "http://localhost:3000/json/screen.json";

                            request({
                                url: url,
                                json: true
                            }, function (error, response, body) {

                                if (!error && response.statusCode === 200) {
                                  ScreenContents.remove({}, function(err) {
                                     console.log('collection moviecontents removed')
                                  });
                                    var a = body["data"]

                                    for (var i=0; i<a.length; i++) {

                                      seat = [
                                        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                                        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                                        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                                        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                                        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                                        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                                        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                                        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                                        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                                        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                                        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                                        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                                        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                                        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                                        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                                        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                                        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                                        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
                                      ]
                                      var newScreenContents = new ScreenContents;
                                      newScreenContents.theater = a[i].theater
                                      newScreenContents.state = a[i].state
                                      newScreenContents.screen_num = a[i].screen_num
                                      newScreenContents.room = a[i].room
                                      newScreenContents.title_eng = a[i].title_eng
                                      newScreenContents.start_time = a[i].start_time
                                      newScreenContents.date = a[i].date
                                      newScreenContents.seat.push(seat)
                                      newScreenContents.save(function (err)  {
                                        if (err) throw err;
                                        // console.log(user + ' : ' + title + ' ' + action)
                                      });
                                    }
                                    callback('================================================\n==================init is done==================\n================================================')

                                }

                            });

                        }

                    });
                }

            });
          });
        });
      });
    });
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
