var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var screenSchema = mongoose.Schema({
  state: String,
  theater: String,
  room: String,
  screen_num: String,
  title_eng: String,
  start_time: String,
  end_time: String,
  seat:[]
});



module.exports =  mongoose.model('ScreenContents', screenSchema);
