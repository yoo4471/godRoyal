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

/* GET home page. */
router.get('/test', function(req, res, next) {
  ScreenContents.remove({}, function(err) {
     console.log('collection moviecontents removed')
  });
  seat = [
    [ 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
  ]
  var newScreenContents = new ScreenContents;
  newScreenContents.theater = "가산디지털"
  newScreenContents.screen_num = "1"
  newScreenContents.screen_type = "2D"
  newScreenContents.title_eng = "Lost in Paris"
  newScreenContents.start_time = "1000"
  newScreenContents.end_time = "1200"
  newScreenContents.seat.push(seat)
  newScreenContents.save(function (err)  {
    if (err) throw err;
    // console.log(user + ' : ' + title + ' ' + action)
  });

  res.send('good')

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
    res.render('latestoffice', {
        rows: movieContents_date,
        rows_order: orderContents,
        email: req.session.email

    });
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
          res.send('추천 기록 없음')
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

                }
              );//res.render
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
  var comment = {
    "email" : req.body.email,
    "text" : req.body.comment
  }

  MovieContents.findOneAndUpdate({ "title_eng": req.body.title_eng}, {"$push": { "comment": comment} } ).exec(function(err, rateContents){
     if(err) return res.status(500).send({error: 'database failure'});
        res.redirect('/movies/detail/' + req.body.title_eng)
  });

});

router.get('/reserve', function(req, res, next) {
  res.render('reserve')
});//get

router.get('/reserve/:title_eng/:theater/:screen_num', function(req, res, next) {
  var theater = req.params.theater
  var title_eng = req.params.title_eng
  var screen_num = req.params.screen_num

  console.log(theater, title_eng, screen_num)
  ScreenContents.find({"title_eng":title_eng, "theater":theater, "screen_num":screen_num}, function(err, screenContents){


    if(err) return res.status(500).send({error: 'database failure'});
    // res.json(screenContents);
    var seat = screenContents[0].seat[0]

    res.render('reserve', {
        seat: seat,
        title_eng: title_eng,
        theater: theater,
        screen_num: screen_num,
        email: req.session.email

        }
      );
  });
});//get

router.post('/reserve', function(req, res, next) {
  console.log(req.body.seat)
  var columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R"]


  ScreenContents.find({"title_eng":req.body.title_eng, "theater":req.body.theater, "screen_num":req.body.screen_num}, function(err, screenContents){
    if(err) return res.status(500).send({error: 'database failure'});
      // res.json(screenContents);

      var seat = screenContents[0].seat[0]

      for( var i = 0; i < req.body.seat.length; i++){
        var column = columns.indexOf(req.body.seat[i][0])
        var row = parseInt(req.body.seat[i].substring(1,3)) - 1

        console.log(column, row)
        seat[column][row] = 1




      }

      // console.log(seat)
      ScreenContents.findOneAndUpdate({"title_eng":req.body.title_eng, "theater":req.body.theater, "screen_num":req.body.screen_num}, { "$pop": { "seat": -1 }} ).exec(function(err, screenContents){
         if(err) return res.status(500).send({error: 'database failure'});

         ScreenContents.findOneAndUpdate({"title_eng":req.body.title_eng, "theater":req.body.theater, "screen_num":req.body.screen_num}, { "$push": { "seat": seat}} ).exec(function(err, screenContents){
            if(err) return res.status(500).send({error: 'database failure'});
            console.log(screenContents.seat)
            res.send('done')




         });

         



      });

      // console.log(seat)



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
  ScreenContents.find({"title_eng":"Lost in Paris", "theater":"가산디지털", "screen_num":'1'},{},function(err, movieContents){
      if(err) return res.status(500).send({error: 'database failure'});


      res.json(movieContents)

  })


});//get

module.exports = router;
