var createError = require('http-errors');

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mongoose = require('mongoose');
var session = require('express-session');
var FileStore=require('session-file-store')(session);

var passport=require('passport');
var config =require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var uploadRouter =require('./routes/uploadRouter');

var dishRouter = require('./routes/dishRouter');
var leaderRouter = require('./routes/leaderRouter');
var promoRouter = require('./routes/promoRouter');

var Dishes = require('./models/dishes');
var Promotions = require('./models/promotions');
var Leaders = require('./models/leaders');

const url = config.mongoUrl;

const connect = mongoose.connect(url);
connect.then((db) => {
  console.log('Connected to the database');
}, (err) => {
  console.log(err);
})

var app = express();


app.use(cookieParser('12345-67890-09876-54321'));

app.use(session({
  name : 'session-id',
  secret:'12345-67890-09876-54321',
  saveUninitialized:false,
  resave :false,
  store:new FileStore()
}))    


app.use(passport.initialize());
app.use(passport.session());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all('*', (req, res, next) => {
  if (req.secure) {
  return next();
  }
  else {
  res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') +
  req.url);
  }
  });
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/imageUpload',uploadRouter);

app.use('/dishes', dishRouter);
app.use('/leaders', leaderRouter);
app.use('/promotions', promoRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
  app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

