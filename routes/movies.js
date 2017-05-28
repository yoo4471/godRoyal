var express = require('express');
var MovieContents = require('../models/movieSchema');
var UserContents = require('../models/userSchema');
var cookieSession = require('cookie-session')
var recommend = require('./recommend')
var router = express.Router();



router.use(cookieSession({
  name: 'session',
  keys: ['A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

/* GET home page. */
router.get('/', function(req, res, next) {
  var a = recommend.test();
  res.redirect('/boxoffice');
});//get



/* GET home page. */
router.get('/boxoffice', function(req, res, next) {
  MovieContents.find({current:1}, function(err, boardContents){

  if(err) return res.status(500).send({error: 'database failure'});

  // console.log(boardContents[0].img_url);
  // res.render('update', {title:"글 수정", error:"", row: boardContents});

  res.render('boxoffice', {
      rows: boardContents,
      email: req.session.email
      }
    );
  });
});//get







module.exports = router;
