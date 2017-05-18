var mongoose = require('mongoose');
var autoincrement = require('mongoose-autoincrement');
mongoose.Promise = global.Promise;

mongoose.plugin(autoincrement);

var movieSchema = mongoose.Schema({
  title_kor: String,
  title_eng: String,
  nation: String,
  relese_date: String,
  run_time: String,
  grade: String,
  director: String,
  actors: String,
  description_title: String,
  current: String
});



module.exports =  mongoose.model('MovieContents', movieSchema);
