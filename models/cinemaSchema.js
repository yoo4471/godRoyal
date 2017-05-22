var mongoose = require('mongoose');
mongoose.Promise = global.Promise;


var theaterSchema = mongoose.Schema({
  region: String,
  theater_name: String,

});

var cinemaSchema = mongoose.Schema({
  region: String,
  gu: String,
  cinema_no: String,
  relese_date: String,
  run_time: String,
  grade: String,
  director: String,
  actors: String,
  description_title: String,
  current: String
});



module.exports =  mongoose.model('CinemaContents', cinemaSchema);
