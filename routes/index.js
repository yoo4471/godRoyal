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

  MovieContents.find(function(err, latestContents){
  if(err) return res.status(500).send({error: 'database failure'});

    movieContents_date = latestContents.slice();
    movieContents_date.sort(function (a, b) {
      return b.release_date - a.release_date;
    });
    res.render('index', {
        rows: boardContents,
        rowslatest: movieContents_date,
        email: req.session.email

    });
  });

  });//find
});//get

router.get('/login', function(req, res, next) {


  res.render('login', {
      login:true,
      email:req.session.email,
      status:"Login",
      signup:"REGISTER"
    });
});

router.post('/login', function(req, res, next) {
  var email = req.body.email;
  var passwd = req.body.passwd


  UserContents.findOne({email:email}, function(err, userContents){

    if(userContents == null) {
      res.render('login', {
          login:true,
          email:req.session.email,
          status:"Invalid Email",
          signup:"REGISTER"
        });
    }
    else {
      userContents.comparepasswd(passwd, function(err, isMatch) {
        if (err) throw err;

        if(isMatch) {
          req.session.email = email
          if(req.session.email == 'admin')
          {
            res.redirect('/dashboard')
          }
          else {
            res.redirect('/')
          }

        }
        else {
          res.render('login', {
              login:true,
              email:req.session.email,
              status:"Invalid Password",
              signup:"REGISTER"
            });
        }
      });
    }




  });

});

router.get('/signup', function(req, res, next) {
  res.render('login', {
      login:false,
      email:req.session.email,
      status:"Login",
      signup:"REGISTER"
    });
});

router.post('/signup', function(req, res, next) {
  var email = req.body.email;
  var passwd = req.body.passwd;
  var passwd_check = req.body.passwd_check;

  UserContents.findOne({email:email}, function(err, userContents){
    console.log(userContents)
    if(userContents == null) {
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
    }
    else {
      res.render('login', {
          login:false,
          email:req.session.email,
          status:"Login",
          signup:"Existing email"
        });
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
  var title = req.query.title_eng
  console.log(title)
  MovieContents.find({title_eng:{$regex:title}}, function(err, movieContents){
    MovieContents.find({title_kor:{$regex:title}}, function(err, movieContentsk){
        if(err) return res.status(500).send({error: 'database failure'});


          res.render('search', {
            str: title,
            rows: movieContents,
            rowsk: movieContentsk,
            email: req.session.email
          })
    });
  });
});




router.get('/search/:title_eng', function(req, res, next) {
  var title = req.params.title_eng;
  console.log(title)
  MovieContents.find({title_eng:{$regex:title}}, function(err, movieContents){
    MovieContents.find({title_kor:{$regex:title}}, function(err, movieContentsk){
        if(err) return res.status(500).send({error: 'database failure'});


          res.render('search', {
            str: title,
            rows: movieContents,
            rowsk: movieContentsk,
            email: req.session.email
          })
    });
  });
});


module.exports = router;
