var mongoose = require('mongoose');
var autoincrement = require('mongoose-autoincrement');
mongoose.Promise = global.Promise;

mongoose.plugin(autoincrement);

var movieSchema = mongoose.Schema({
  title_kor: String,
  title_eng: String,
  nation: String,
  genre: String,
  release_date: String,
  run_time: String,
  grade: String,
  director: String,
  actors: String,
  description_title: String,
  description: String,
  current: String,
  img_url: String
});



module.exports =  mongoose.model('MovieContents', movieSchema);
