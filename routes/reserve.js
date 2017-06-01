var express = require('express');
var MovieContents = require('../models/movieSchema');
var UserContents = require('../models/userSchema');
var RateContents = require('../models/rateSchema');
var ScreenContents = require('../models/screenSchema');
var cookieSession = require('cookie-session')
var recommend = require('./recommend')
var router = express.Router();

router.get('/', function(req, res, next) {
  res.redirect('/reserve/Lost in Paris/가산디지털/1')
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

            res.send('done')
         });
      });
    });
});//get





router.get('/complete/:email', function(req, res, next) {
  res.send(req.params.email + ' 이 유저에 대한 예약 내역 보여주는 페이지 만들면 된다.')
});//get

router.get('/show1', function(req, res, next) {
  ScreenContents.find({}, function(err, screenContents){


    if(err) return res.status(500).send({error: 'database failure'});
    // res.json(screenContents);
    res.json(screenContents)

  });
});//get




module.exports = router;
