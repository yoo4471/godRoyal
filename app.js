var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var dashboard = require('./routes/dashboard');
var MovieContents = require('./models/movieSchema');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/dashboard', dashboard);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Mongoose
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// connect to MongoDB / the name of DB is set to 'myDB'
mongoose.connect('mongodb://localhost/myMovie');

// we get the pending connection to myDB running on localhost
var db = mongoose.connection;
// we get notified if error occurs
db.on('error', console.error.bind(console, 'connection error:'));
// executed when the connection opens
db.once('open', function callback () {
	// add your code here when opening
  	console.log("Connected to mongod server");
});

MovieContents.remove({}, function(err) {
   console.log('collection removed')
});





/* Initialize - insert movie database */
function insertMovie() {
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

            newMovieContents.save(function (err)  {
              if (err) throw err;
              console.log('success join')
            });
          }
          // var a = body.replace("\n", "")



      }

  });
}

insertMovie();
// Mongoose

module.exports = app;
