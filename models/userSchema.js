var mongoose = require('mongoose');
var autoincrement = require('mongoose-autoincrement');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

mongoose.Promise = global.Promise;

mongoose.plugin(autoincrement);

var userSchema = mongoose.Schema({
  email: { type: String, unique: true },
  passwd: String
});

userSchema.pre('save', function(next) {
    var user = this;

    // only hash the passwd if it has been modified (or is new)
    if (!user.isModified('passwd')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the passwd using our new salt
        bcrypt.hash(user.passwd, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext passwd with the hashed one
            user.passwd = hash;
            next();
        });
    });
});

userSchema.methods.comparepasswd = function(candidatepasswd, cb) {
    bcrypt.compare(candidatepasswd, this.passwd, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports =  mongoose.model('UserContents', userSchema);
