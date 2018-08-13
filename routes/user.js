var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var userSchema = mongoose.model('User', require('../models/user.js'));
mongoose.connect('mongodb://localhost/stockerplace')

router.post('/subscribe', function (req, res, next) {
    userSchema.findByPseudo(req.body.pseudo)
        .then(user => {
            if (user.length === 0) {
                var user = new userSchema({
                    pseudo : req.body.pseudo,
                    password : req.body.password,
                    email : req.body.email
                });
                user.save();
                res.send(user);
            }
            else {
                res.send(false);
            }
        })
        .catch(err => console.log('ERR', err))
});

router.post('/connexion', function (req, res, next) {
    userSchema.checkConnection(req.body.pseudo, req.body.password)
        .then(user => {
            if (user.length === 0) {
                res.send(false);
            }
            else {
                res.send(user);
            }
        })
});

module.exports = router;