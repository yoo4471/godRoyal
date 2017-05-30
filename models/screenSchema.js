var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var screenSchema = mongoose.Schema({
  theater: String,
  screen_num: String,
  screen_type: String,
  title_eng: String,
  start_time: String,
  end_time: String,
  seat:[]
});



module.exports =  mongoose.model('ScreenContents', screenSchema);