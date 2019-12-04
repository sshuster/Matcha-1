var express = require('express');
var router = express.Router();
var iplocation = require("iplocation").default;
const app = express();
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.connect(`mongodb+srv://gstrauss:qwerty0308@matcha-ch0yb.gcp.mongodb.net/test?retryWrites=true&w=majority`);
app.use(bodyParser.urlencoded({ extended: true }));
var Models = require("../models/models");
var crypto = require('crypto');
const requestIp = require('request-ip');

// const ipMiddleware = function(req, res, next) {
//    const clientIp = requestIp.getClientIp(req);
//    console.log(1000);
//    console.log(clientIp);
//    Model.user.findOne({email:req.body.email})
//    next();
// };

router.post('/login', bodyParser.urlencoded(), function(req, res){
   Models.user.findOne({ email: req.body.email }, function(err, user) {
      if(user)
      {
         var safe = crypto.pbkdf2Sync(req.body.password, '100' ,1000, 64, `sha512`).toString(`hex`);

            if(user.password == safe && user.isverified == 1)
            {
               const clientIp = requestIp.getClientIp(req);
               // ip tracking
               Models.user.findOneAndUpdate({ email : req.body.email },
                  { "location" : clientIp }
                  , function(err, _update) {
                      console.log("updated Ip Location");
              });
              //setting session
               Models.user.findOne({email:req.body.email})
               req.session.name = req.body.email;
               res.redirect('/profile');
            }
            else
            res.send("Somethings wrong, please ensure you verified your account by following the link and that you typed your password in correctly");
               // res.redirect('/login');
      }
   });
});

//export this router to use in our index.js
module.exports = router;