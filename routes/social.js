var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.json({
    social: 'La route social'
  });
});

module.exports = router;
