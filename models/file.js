var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fileSchema = new Schema({
    path:  String,
    showName: String,
    userId: Schema.ObjectId
  });

  fileSchema.statics.findByPath = function(path) {
    return this.model('File').find({ path : path });
  }

  fileSchema.statics.findByUserId = function(userId) {
    return this.model('File').find({ userId : userId });
  }

  fileSchema.statics.findById = function(fileId) {
    return this.model('File').findOne({ _id : fileId });
  }

module.exports = fileSchema;