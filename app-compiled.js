'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

var Player = function Player(name) {
  _classCallCheck(this, Player);

  this.name = name;
  this.highscores = [];
};

var Highscore = function Highscore(date, score) {
  _classCallCheck(this, Highscore);

  this.date = date;
  this.score = score;
};

var peter = new Player("Peter");
peter.highscores.push(new Highscore("jetzt", 5));
peter.highscores.push(new Highscore("jetzt", 10));
peter.highscores.push(new Highscore("jetzt", 15));

var markus = new Player("Markus");
markus.highscores.push(new Highscore("jetzt", 5));
markus.highscores.push(new Highscore("jetzt", 10));
markus.highscores.push(new Highscore("jetzt", 15));

var lukas = new Player("Lukas");
lukas.highscores.push(new Highscore("jetzt", 5));
lukas.highscores.push(new Highscore("jetzt", 10));
lukas.highscores.push(new Highscore("jetzt", 15));

var michael = new Player("Michael");
michael.highscores.push(new Highscore("jetzt", 5));
michael.highscores.push(new Highscore("jetzt", 10));
michael.highscores.push(new Highscore("jetzt", 15));

var highscores_players_obj = [peter, markus, lukas, michael];

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* GET home page. */
app.get('/', function (req, res) {
  res.render('index');
});

/* Highscores */
app.get('/highscores', function (req, res) {
  req.accepts('html');
  req.accepts('text/html');
  req.accepts('json, text');
  req.accepts('application/json');

  if (req.get("accept") == 'application/json') {
    res.json(highscores_players_obj);
  } else {
    res.render('highscores', { highscores: highscores_players_obj });
  }
});

app.post('/highscores', function (req, res) {
  console.log(req.body);

  if (playerIsAlreayInHighscores(req.body.name)) {} else {
    /* Add as new Player */
    var player = new Player(req.body.name);
    player.highscores.push(new Highscore(Date.now(), req.body.score));
    highscores_players_obj.push(player);
  }

  res.json(highscores_players_obj);
});

/* Players */
app.get('/players', function (req, res) {
  res.render('players', {
    players: { player: highscores_players_obj }
  });
});

app.post('/players', function (req, res) {});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;

//# sourceMappingURL=app-compiled.js.map