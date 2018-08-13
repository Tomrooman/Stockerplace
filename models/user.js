var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    pseudo:  String,
    password: String,
    email:   String,
  });

  userSchema.statics.findByPseudo = function(pseudo) {
      return this.model('User').find({ pseudo : pseudo });
  }

  userSchema.statics.checkConnection = function(pseudo, password) {
    return this.model('User').find({
        pseudo : pseudo,
        password : password
    });
}

module.exports = userSchema;