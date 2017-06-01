var express = require('express');
var MovieContents = require('../models/movieSchema');
var UserContents = require('../models/userSchema');
var RateContents = require('../models/rateSchema');
var ScreenContents = require('../models/screenSchema');
var ReserveContents = require('../models/reserveSchema');
var cookieSession = require('cookie-session')
var recommend = require('./recommend')
var router = express.Router();

router.get('/', function(req, res, next) {
  res.redirect('/reserve/Lost in Paris/가산디지털/1')
});//get

/* GET home page. */

router.get('/init1', function(req, res, next) {
  ScreenContents.remove({}, function(err) {
     console.log('collection moviecontents removed')
  });

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

      }

  });
  res.send('init완료')

});//get
router.get('/show1', function(req, res, next) {


  ScreenContents.find({}, function(err, screenContents){


    if(err) return res.status(500).send({error: 'database failure'});
    res.json(screenContents);

  });
});//get


router.get('/:title_eng/:theater/:start_time', function(req, res, next) {
  var theater = req.params.theater
  var title_eng = req.params.title_eng
  var start_time = req.params.start_time


  ScreenContents.find({"title_eng":title_eng, "theater":theater, "start_time":start_time}, function(err, screenContents){


    if(err) return res.status(500).send({error: 'database failure'});
    // res.json(screenContents);
    var seat = screenContents[0].seat[0]

    res.render('reserve', {
        seat: seat,
        title_eng: title_eng,
        theater: theater,
        start_time: start_time,
        email: req.session.email

        }
      );
  });
});//get

router.post('/', function(req, res, next) {
  console.log(req.body)

  var columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R"]
  if (req.body.seat.constructor === String) {
    var body_seat = []
    body_seat.push(req.body.seat)
  }
  else {
    body_seat = req.body.seat
  }

  /*  공동환
      티켓 내역임
      body_seat = [A1, A2, A3 ...]
      예약 내역 스키마 만들어서 저장하면 됨

  */
  console.log(body_seat)
  console.log(req.body.email)
  console.log(req.body.theater)
  console.log(req.body.title_eng)
  console.log(req.body.start_time)
  /* 공동환 */
  ScreenContents.find({"title_eng":req.body.title_eng, "theater":req.body.theater, "start_time":req.body.start_time}, function(err, screenContents){
    if(err) return res.status(500).send({error: 'database failure'});
      // res.json(screenContents);

      var seat = screenContents[0].seat[0]

      for( var i = 0; i < body_seat.length; i++){
        var column = columns.indexOf(body_seat[i][0])
        var row = body_seat[i].substr(1)
        var row = row = parseInt(row) - 1
        seat[column][row] = 1
      }

      // console.log(seat)
      ScreenContents.findOneAndUpdate({"title_eng":req.body.title_eng, "theater":req.body.theater, "start_time":req.body.start_time}, { "$pop": { "seat": -1 }} ).exec(function(err, screenContents){
         if(err) return res.status(500).send({error: 'database failure'});

         ScreenContents.findOneAndUpdate({"title_eng":req.body.title_eng, "theater":req.body.theater, "start_time":req.body.start_time}, { "$push": { "seat": seat}} ).exec(function(err, screenContents){
            if(err) return res.status(500).send({error: 'database failure'});
            var newReserveContents = new ReserveContents;
            newReserveContents.email = req.body.email
            newReserveContents.theater = req.body.theater
            newReserveContents.title_eng = req.body.title_eng
            newReserveContents.start_time = req.body.start_time
            newReserveContents.status = 1
            for( var j = 0; j < body_seat.length; j++) {
              newReserveContents.seat.push(body_seat[j])
            }

            newReserveContents.save(function (err)  {
              if (err) throw err;
              // console.log(user + ' : ' + title + ' ' + action)
            });
            res.send('done')
         });
      });
    });
});//get





router.get('/complete', function(req, res, next) {

  ReserveContents.find({"email":req.session.email}, function(err, reserveContents){
    if(err) return res.status(500).send({error: 'database failure'});
    console.log(reserveContents)
    // if (reserveContents.length == 0) {
    //   res.redirect('/movies/boxoffice?noreserve=1')
    // }

    MovieContents.find({ }, function(err, movieContents){
    if(err) return res.status(500).send({error: 'database failure'});

    ScreenContents.find({}, function(err, screenContents){
    if(err) return res.status(500).send({error: 'database failure'});
      res.render('complete_reserve', {
          rows: reserveContents,
          title: movieContents,
          screens: screenContents,
          email: req.session.email

      });
    });

    });
  });
});//get

router.get('/show1', function(req, res, next) {
  ScreenContents.find({}, function(err, screenContents){


    if(err) return res.status(500).send({error: 'database failure'});
    // res.json(screenContents);
    res.json(screenContents)

  });
});//get

router.get('/test', function(req, res, next) {
  res.render('complete_reserve')
});//get


module.exports = router;
