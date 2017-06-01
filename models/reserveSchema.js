var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var reserveSchema = mongoose.Schema({
  title_eng:String,
  theater:String,
  email:String,
  start_time:String,
  seat:[],
  status:Number
});

module.exports =  mongoose.model('ReserveContents', reserveSchema);
