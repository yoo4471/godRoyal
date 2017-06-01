var express = require('express');
var MovieContents = require('../models/movieSchema');
var UserContents = require('../models/userSchema');
var RateContents = require('../models/rateSchema');
var ScreenContents = require('../models/screenSchema');
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

router.insert_db_rates = function(user, title, action) {


}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/movies/boxoffice');
});//get





router.get('/myinfo', function(req, res, next) {
  var num_rate_total= 0
  var num_rate_good = 0
  var num_rate_bad = 0
  var num_rate_average = 0
  var num_comment_total = 0
  var dic_nation = []
  var list_rate_nation = []
  var num_total_time = 0
  var dic_genre = []
  RateContents.find({ person:req.session.email }, function(err, rateContents){
      if(err) return res.status(500).send({error: 'database failure'});

      num_rate_total= rateContents.length

      for (var i = 0; i < rateContents.length; i++) {
        list_rate_nation.push(rateContents[i].thing)
        if(rateContents[i].action == 'likes') {
          num_rate_good = num_rate_good + 1
        }
        else {
          num_rate_bad = num_rate_bad + 1
        }
      }

      if (num_rate_total != 0) {
        num_rate_average = (num_rate_good / num_rate_total) * 5;
        num_rate_average = num_rate_average.toFixed(1);
      }


      MovieContents.find({}, function(err, movieContents){
          if(err) return res.status(500).send({error: 'database failure'});


          var num_like = 0

          for (var i = 0; i < movieContents.length; i++) {

            if(list_rate_nation.indexOf(movieContents[i].title_eng) > -1) {
              num_total_time = num_total_time + parseInt(movieContents[i].run_time)
              //if user likes this movie
              if(movieContents[i].likes.indexOf(req.session.email) > -1) {
                num_like = 1
              }
              else {
                num_like = 0
              }

              //search nation
              var result = dic_nation.filter(function(v) {
                  return v.key === movieContents[i].nation; // Filter out the appropriate one
              })

              if(result.length == 0) {
                dic_nation.push({
                    key:   movieContents[i].nation,
                    value: 1,
                    like: num_like
                });
              }
              else {
                result[0].value = result[0].value + 1
                result[0].like = result[0].like + num_like
              }

              //search genre
              var list_genre = movieContents[i].genre
              for (var k = 0; k < list_genre.length; k++) {
                var result_genre = dic_genre.filter(function(v) {
                    return v.key === list_genre[k]; // Filter out the appropriate one
                })
                if(result_genre.length == 0) {
                  dic_genre.push({
                      key:   list_genre[k],
                      value: 1,
                      like:num_like
                  });
                }
                else {
                  result_genre[0].value = result_genre[0].value + 1,
                  result_genre[0].like = result_genre[0].like + 1
                }
              }

            }


            // calculate number of comment
            var comment = movieContents[i].comment
            for (var j = 0; j < comment.length; j++) {
              if(comment[j]['email'] == req.session.email) {
                num_comment_total = num_comment_total + 1
              }
            }
          }

          dic_nation.sort(function (a, b) {
            return b.like - a.like;
          });
          dic_genre.sort(function (a, b) {
            return b.value - a.value;
          });
          num_total_time = num_total_time / 60
          num_total_time = num_total_time.toFixed(0)

          console.log(dic_genre)


          res.render('myinfo', {
              num_rate_total: num_rate_total,
              num_rate_average:num_rate_average,
              num_comment_total:num_comment_total,
              dic_nation: dic_nation,
              dic_genre:dic_genre,
              num_total_time: num_total_time,
              email: req.session.email,

          });

  // orderContents = movieContents.slice();
  // orderContents.sort(function (a, b) {
  //   return b.likes.length - a.likes.length;
  // });
  //
  // res.render('myinfo', {
  //     rows: movieContents,
  //     rows_order: orderContents,
  //     email: req.session.email
  //
      });
  });
});//get


router.get('/myticket', function(req, res, next) {
  MovieContents.find({ current:1 }, function(err, movieContents){

  if(err) return res.status(500).send({error: 'database failure'});
  orderContents = movieContents.slice();
  orderContents.sort(function (a, b) {
    return b.likes.length - a.likes.length;
  });

  res.render('myticket', {
      rows: movieContents,
      rows_order: orderContents,
      email: req.session.email

      }
    );
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
  if(req.query.noreserve==1){
    res.render('boxoffice', {
        rows: movieContents,
        rows_order: orderContents,
        email: req.session.email,
        noreserve:true
    });
  }
  else {
    res.render('boxoffice', {
        rows: movieContents,
        rows_order: orderContents,
        email: req.session.email,
        noreserve:false

    });
  }

  });
});//get

/* GET home page. */
router.get('/latestoffice', function(req, res, next) {
  MovieContents.find({ current:1 }, function(err, movieContents){

  if(err) return res.status(500).send({error: 'database failure'});

  orderContents = movieContents.slice();
  orderContents.sort(function (a, b) {
    return b.likes.length - a.likes.length;
  });


  MovieContents.find(function(err, boardContents){
  if(err) return res.status(500).send({error: 'database failure'});

    movieContents_date = boardContents.slice();
    movieContents_date.sort(function (a, b) {
      return b.release_date - a.release_date;
    });
    if(req.query.norate==1){
      res.render('latestoffice', {
          rows: movieContents_date,
          rows_order: orderContents,
          email: req.session.email,
          norate:true
      });
    }
    else {
      res.render('latestoffice', {
          rows: movieContents_date,
          rows_order: orderContents,
          email: req.session.email,
          norate:false

      });
    }

  });



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

        if(recommendations['recommendations'].length == 0) {
          res.redirect('/movies/latestoffice?norate=1')
        }
        else {
          var recomm_list = []
          var recomm_NaN = []
          console.log("\nRecommendations For " + req.session.email)
          console.log(JSON.stringify(recommendations,null,2))
          recommend.movies(recommendations['recommendations'], (function(response){
            for (var i = 0; i < recommendations['recommendations'].length; i++) {
              if(recommendations['recommendations'][i]['weight'] != 'NaN') {
                recomm_NaN.push(recommendations['recommendations'][i])
                recomm_list.push(recommendations['recommendations'][i]['thing'])
              }

            }

            response.sort(function(a,b){
              return recomm_list.indexOf(a.title_eng) < recomm_list.indexOf(b.title_eng) ? -1 : 1;
            });

            console.log(recommendations['recommendations'])
            res.render('recommend', {
                rows: response,
                rows_recomm: recommendations['recommendations'],
                email: req.session.email
                });//res.render
          }))//end_recommed
        }


      })//then`

    });//RateContents.find

  }//endif
  else {
    res.redirect('/login')
  }//endelse

});//get

router.get('/detail/:title_eng', function(req, res, next) {
  var title = req.params.title_eng;
  console.log(title)
  MovieContents.find({title_eng:title}, function(err, movieContents){
      if(err) return res.status(500).send({error: 'database failure'});


      if (movieContents.length == 0) {
        res.send('영화없음.')
      }
      else {

        var a = movieContents[0].comment

        console.log(a.length)
        res.render('movie-detail', {
          rows: movieContents,
          email: req.session.email
        })
      }
  });
    // console.log(boardContents[0].img_url);
    // res.render('update', {title:"글 수정", error:"", row: boardContents});


});

router.get('/booking-one-temp/:title_eng', function(req, res, next) {
  var title = req.params.title_eng
  console.log(title)
  MovieContents.find({title_eng:title}, function(err, movieContents){
      if(err) return res.status(500).send({error: 'database failure'});

      ScreenContents.find({title_eng:title, screen_num:'1'}, function(err, screenContents){
          if(err) return res.status(500).send({error: 'database failure'});

          res.render('booking-one-temp', {
            screens: screenContents,
            rows: movieContents,
            email: req.session.email
          })

      });
  });
    // console.log(boardContents[0].img_url);
    // res.render('update', {title:"글 수정", error:"", row: boardContents});

});

router.get('/booking-two-temp/:title_eng/:theater', function(req, res, next) {
  var title = req.params.title_eng
  var tt = req.params.theater
  console.log(title)
  MovieContents.find({title_eng:title}, function(err, movieContents){
      if(err) return res.status(500).send({error: 'database failure'});

      ScreenContents.find({title_eng:title, theater: tt }, function(err, screenContents){
          if(err) return res.status(500).send({error: 'database failure'});

          orderContents = screenContents.slice();
          orderContents.sort(function (a, b) {
            var num_a = a.screen_num
            num_a = parseInt(num_a)
            var num_b = b.screen_num
            num_b = parseInt(num_b)
            return num_a - num_b;
          });

          res.render('booking-two-temp', {
            screens: orderContents,
            rows: movieContents,
            email: req.session.email
          })

      });
  });
});
router.get('/booking-one/:title_eng', function(req, res, next) {

  var title = req.params.title_eng
  console.log(title)
  MovieContents.find({title_eng:title}, function(err, movieContents){
      if(err) return res.status(500).send({error: 'database failure'});

      ScreenContents.find({title_eng:title, screen_num:'1'}, function(err, screenContents){
          if(err) return res.status(500).send({error: 'database failure'});

          if(!req.session.email)
          {
          res.redirect('/login')
        }
        else
        {
          res.render('booking-one', {
            screens: screenContents,
            rows: movieContents,
            email: req.session.email
          })
        }



      });
  });
    // console.log(boardContents[0].img_url);
    // res.render('update', {title:"글 수정", error:"", row: boardContents});

});
router.get('/:title_eng/booking-movie-detail', function(req, res, next) {
  var title = req.params.title_eng;
  console.log(title)
  MovieContents.find({title_eng:title}, function(err, movieContents){
      if(err) return res.status(500).send({error: 'database failure'});


      if (movieContents.length == 0) {
        res.send('영화없음.')
      }
      else {

        var a = movieContents[0].comment

        console.log(a.length)
        res.render('booking-movie-detail', {
          rows: movieContents,
          email: req.session.email
        })
      }
  });
});



router.get('/booking-three/:title_eng/:theater/:start_time', function(req, res, next) {
  var title = req.params.title_eng
  var tt = req.params.theater
  var st = req.params.start_time
  console.log(title)
  MovieContents.find({title_eng:title}, function(err, movieContents){
      if(err) return res.status(500).send({error: 'database failure'});

      ScreenContents.find({title_eng:title, theater: tt, start_time: st}, function(err, screenContents){
          if(err) return res.status(500).send({error: 'database failure'});
          console.log(screenContents)
          res.render('booking-three', {
            screens: screenContents,
            rows: movieContents,
            title_eng:title,
            theater:tt,
            start_time:st,
            email: req.session.email
          })

      });
  });
});

router.post('/update/rating_bad', function(req, res, next) {

  console.log(req.body)
  if (req.body.status == 1) {
    MovieContents.findOneAndUpdate({ "title_eng": req.body.title_eng}, { "$pop": { "likes": req.body.email} , "$push": { "dislikes": req.body.email} } ).exec(function(err, rateContents){
       if(err) return res.status(500).send({error: 'database failure'});
       RateContents.findOneAndUpdate({ "thing": req.body.title_eng, "person": req.body.email}, { "$set": { "action": 'dislikes'}}).exec(function(err, rateContents){
          if(err) return res.status(500).send({error: 'database failure'});
          res.send('done')
       });
    });

  }
  else {
    MovieContents.findOneAndUpdate({ "title_eng": req.body.title_eng}, {"$push": { "dislikes": req.body.email} } ).exec(function(err, rateContents){
       if(err) return res.status(500).send({error: 'database failure'});
       recommend.insert_db_rates(req.body.email, req.body.title_eng, 'dislikes')
       res.send('done')
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
          res.send('done')
       });
    });

  }
  else {
    MovieContents.findOneAndUpdate({ "title_eng": req.body.title_eng}, {"$push": { "likes": req.body.email} } ).exec(function(err, rateContents){
       if(err) return res.status(500).send({error: 'database failure'});
       recommend.insert_db_rates(req.body.email, req.body.title_eng, 'likes')
       res.send('done')
    });
  }


});//get

router.get('/comment/:email/:title_eng', function(req, res, next) {
  var title = req.params.title_eng;
  var email = req.params.email;


  MovieContents.find({current:1}, function(err, boardContents){

  if(err) return res.status(500).send({error: 'database failure'});

  // console.log(boardContents[0].img_url);
  // res.render('update', {title:"글 수정", error:"", row: boardContents});

  res.render('movie-comment', {
    rows: boardContents,
    email: req.session.email,
    title_eng: title
  });
  });
});

router.post('/comment/:email/:title_eng', function(req, res, next) {
  console.log(req.body)
  var today = new Date();

  var comment = {
    "email" : req.body.email,
    "text" : req.body.comment,
    "date" : today.toISOString().substring(0, 10)
  }

  MovieContents.findOneAndUpdate({ "title_eng": req.body.title_eng}, {"$push": { "comment": comment} } ).exec(function(err, rateContents){
     if(err) return res.status(500).send({error: 'database failure'});
        res.redirect('/movies/detail/' + req.body.title_eng)
  });

});


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
  ScreenContents.find({}, function(err, screenContents){


    if(err) return res.status(500).send({error: 'database failure'});
    res.json(screenContents);

  });
});//get

module.exports = router;
