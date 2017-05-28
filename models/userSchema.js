var mongoose = require('mongoose');
var autoincrement = require('mongoose-autoincrement');
mongoose.Promise = global.Promise;

mongoose.plugin(autoincrement);

var userSchema = mongoose.Schema({
  _id: String,
  passwd: String
});



module.exports =  mongoose.model('UserContents', userSchema);
