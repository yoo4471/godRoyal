var mongoose = require('mongoose');
var autoincrement = require('mongoose-autoincrement');
mongoose.Promise = global.Promise;



var rateSchema = mongoose.Schema({
  namespace: {type:String, default:"movies"},
  person: String,
  action: String,
  thing: String,
  expires_at: {type:String, default:"2020-06-06"}
});

module.exports =  mongoose.model('RateContents', rateSchema);
