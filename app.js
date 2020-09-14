var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan'); //for http messages
const bodyParser = require('body-parser');
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


const mongoose = require('mongoose');  //DBM strict schema
mongoose.Promise= require('bluebird'); //Promise control

const url = config.mongoUrl;
const connect= mongoose.connect(url, {useMongoClient: true});
connect.then((db) => {
  console.log("Connection ok to the server");
}, (err) => {console.log(err);});

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);

//use static data from public folder
app.use(express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
