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

/* GET home page. */
router.get('/', function(req, res, next) {
  MovieContents.find({current:1}, function(err, boardContents){

  if(err) return res.status(500).send({error: 'database failure'});
  console.log(req.session)
  // console.log(boardContents[0].img_url);
  // res.render('update', {title:"글 수정", error:"", row: boardContents});

  res.render('index', {
      rows: boardContents,
      email: req.session.email,
    });//render
  });//find
});//get

router.get('/login', function(req, res, next) {

  res.render('login', {
      login:true,
      email:req.session.email
    }
  );
});

router.post('/login', function(req, res, next) {
  var email = req.body.email;
  var passwd = req.body.passwd
  req.session.email = email
  res.redirect('/')
});

router.get('/signup', function(req, res, next) {
  res.render('login', {
      login:false,
      email:req.session.email
    }
  );
});

router.post('/signup', function(req, res, next) {
  var newUserContents = new UserContents;
  newUserContents.email = req.body.email;
  newUserContents.passwd = req.body.passwd;

  newUserContents.save(function (err)  {
    if (err) {
      throw err
      // res.redirect('/login')
    }
    else {
      req.session.email = req.body.email;
      res.redirect('/')
    }

  });
});

router.get('/logout', function(req, res, next) {
  if(req.session.email){
            req.session = null;
            res.redirect('/')
  }//if
  else {
      res.redirect('/');
  }//else
});






router.get('/search', function(req, res, next) {
  MovieContents.find({current:1}, function(err, boardContents){

  if(err) return res.status(500).send({error: 'database failure'});

  // console.log(boardContents[0].img_url);
  // res.render('update', {title:"글 수정", error:"", row: boardContents});

  res.render('search', {rows: boardContents});
  });
});

router.get('/booking-one', function(req, res, next) {
  MovieContents.find({current:1}, function(err, boardContents){

  if(err) return res.status(500).send({error: 'database failure'});

  // console.log(boardContents[0].img_url);
  // res.render('update', {title:"글 수정", error:"", row: boardContents});

  res.render('booking-one', {rows: boardContents});
  });
});
router.get('/booking-two', function(req, res, next) {
  MovieContents.find({current:1}, function(err, boardContents){

  if(err) return res.status(500).send({error: 'database failure'});

  // console.log(boardContents[0].img_url);
  // res.render('update', {title:"글 수정", error:"", row: boardContents});

  res.render('booking-two', {rows: boardContents});
  });
});

router.get('/booking-movie-detail', function(req, res, next) {
  MovieContents.find({current:1}, function(err, boardContents){

  if(err) return res.status(500).send({error: 'database failure'});

  // console.log(boardContents[0].img_url);
  // res.render('update', {title:"글 수정", error:"", row: boardContents});

  res.render('booking-movie-detail', {rows: boardContents});
  });
});

router.get('/movie-comment', function(req, res, next) {
  MovieContents.find({current:1}, function(err, boardContents){

  if(err) return res.status(500).send({error: 'database failure'});

  // console.log(boardContents[0].img_url);
  // res.render('update', {title:"글 수정", error:"", row: boardContents});

  res.render('movie-comment', {rows: boardContents});
  });
});

router.get('/booking-three', function(req, res, next) {
  MovieContents.find({current:1}, function(err, boardContents){

  if(err) return res.status(500).send({error: 'database failure'});

  // console.log(boardContents[0].img_url);
  // res.render('update', {title:"글 수정", error:"", row: boardContents});

  res.render('booking-three', {rows: boardContents});
  });
});

router.get('/seat', function(req, res, next) {
  MovieContents.find({current:1}, function(err, boardContents){

  if(err) return res.status(500).send({error: 'database failure'});

  // console.log(boardContents[0].img_url);
  // res.render('update', {title:"글 수정", error:"", row: boardContents});

  res.render('seat', {rows: boardContents});
  });
});

router.post('/seat', function(req, res, next) {
  res.json(req.body)
});

module.exports = router;
