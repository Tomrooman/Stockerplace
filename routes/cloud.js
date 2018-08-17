var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs-extra');
var mongoose = require('mongoose');
var fileSchema = mongoose.model('File', require('../models/file.js'));

var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    let originalFile = file;
    let path = `upload/${req.headers.username}`;
    let fullpath = `upload/${req.headers.username}/${file.originalname}`;
    fs.mkdirsSync(path);
    fileSchema.findByPath(fullpath)
      .then(file => {
        if (file.length === 0) {
          var file = new fileSchema({
            path: fullpath,
            showName: originalFile.originalname,
            userId: req.headers.userid
          });
          file.save();
        }
      })
    callback(null, path)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })

router.post('/', upload.any(), (req, res) => {
  res.send(true);
});

router.post('/:id', (req, res) => {
  fileSchema.findByUserId(req.params.id)
    .then(file => {
      res.send(file);
    })
});

router.post('/rename/:id', (req, res) => {
  fileSchema.findById(req.params.id)
    .then(file => {
      file.showName = req.body.showName;
      file.save();
      res.send(file);
    })
});

router.post('/remove/:id', (req, res) => {
  fileSchema.deleteOne({ _id: req.params.id })
    .then(file => {
      res.send(true);
    })
});

module.exports = router;
