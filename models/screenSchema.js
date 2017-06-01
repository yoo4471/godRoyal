var mongoose = require('mongoose');
var autoincrement = require('mongoose-autoincrement');
mongoose.Promise = global.Promise;

mongoose.plugin(autoincrement);
var screenSchema = mongoose.Schema({
  state: String,
  theater: String,
  room: String,
  screen_num: String,
  title_eng: String,
  start_time: String,
  end_time: String,
  seat:[],
  date: String
});



module.exports =  mongoose.model('ScreenContents', screenSchema);
