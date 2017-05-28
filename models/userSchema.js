var mongoose = require('mongoose');
var autoincrement = require('mongoose-autoincrement');
mongoose.Promise = global.Promise;

mongoose.plugin(autoincrement);

var userSchema = mongoose.Schema({
  email: { type: String, unique: true },
  passwd: String
});



module.exports =  mongoose.model('UserContents', userSchema);
