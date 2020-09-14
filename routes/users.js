var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport= require('passport');
var authenticate = require("../authenticate");
var cors = require('./cors');
var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.options('*', cors.cors, (req,res) => {res.sendStatus(200);})
router.get('/senduser',cors.cors, function(req, res, next) {
  User.find()
  .then((users) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(users);
  },(err) => next(err))
  .catch((err) => next(err));
});

//notice leader router has no ; so it is the obejct or .all .get .post .put .delete method below it
router.post('/signup',cors.cors,(req, res, next) => {    /*************latest modification */

  User.register(new User({username: req.body.username}),
  req.body.password,(err,user) =>{
      if(err) {
        res.statusCode= 500;
        res.setHeader('Content-Type','application/json');
        res.json({err: err});  
      }
      else{
        if (req.body.firstname)
            user.firstname = req.body.firstname;
        if (req.body.lastname)
            user.lastname = req.body.lastname;
        user.save((err, user) => {
          if(err) {
            res.statusCode= 500;
            res.setHeader('Content-Type','application/json');
            res.json({err: err});  
            return;
          }
          else{
            passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, status: 'Registration Successful' });
        });
          
        }});
      }

    });
});


//notice leader router has no ; so it is the obejct or .all .get .post .put .delete method below it
router.post('/login',cors.cors,(req,res,next) => {

  passport.authenticate('local',(err,user,info) => {
    if(err)
      return next(err);

    if(!user){
      res.statusCode= 401;
      res.setHeader('Content-Type','application/json');
      res.json({ success: false, status: 'Login Unsuccessful!', err:info });
     
    }
    req.logIn(user, (err) => {
      if (err) {
        res.statusCode= 401;
        res.setHeader('Content-Type','application/json');
        res.json({ success: false, status: 'Login Unsuccessful!', err:'Could not log in user' }); 
      }
    
      var token = authenticate.getToken({_id: req.user._id});// similarly 3rd party token can be get via function
      res.statusCode= 200;
      res.setHeader('Content-Type','application/json');
      res.json({ success: true, token: token, status: 'Login successful' });
    });
  }) (req, res, next);  
});


router.get('/logout', (req,res,next) => {
  if(authenticate.verifyUser){
    console.log("I m in");
    //req.session.destroy();//remove d session info
    res.clearCookie('session-id');//destroying cookie on client side
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in hello!');
    err.status = 403;
    next(err);
  }
 }); 



//At reular interval the client will visit this route to check if his jwt expired
router.get('/checkJWTToken', cors.corsWithOptions, (req,res) => {
  passport.authenticate('jwt',{session: false}, (err, user, info) => {
   if(err)
   return next(err);
   
   if(!user){
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    return res.json({status: 'JWT invalid!', success: false, err:info});
   }
   else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.json({status: 'JWT valid!', success: true, user:user});   
   }
  }) (req, res);
});



module.exports = router;
