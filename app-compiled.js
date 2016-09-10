'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// express magic
var express = require('express');
var app = express();
var device = require('express-device');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));
app.use(logger('dev'));

var urlencodedParser = bodyParser.urlencoded({
  extended: true
});

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views/');
app.use(device.capture());

// logs every request
app.use(function (req, res, next) {
  console.log({ method: req.method, url: req.url, device: req.device });
  next();
});

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
peter.highscores.push(new Highscore("jetzt", 1));
peter.highscores.push(new Highscore("jetzt", 5));
peter.highscores.push(new Highscore("jetzt", 9));

var markus = new Player("Markus");
markus.highscores.push(new Highscore("jetzt", 2));
markus.highscores.push(new Highscore("jetzt", 6));
markus.highscores.push(new Highscore("jetzt", 10));

var lukas = new Player("Lukas");
lukas.highscores.push(new Highscore("jetzt", 3));
lukas.highscores.push(new Highscore("jetzt", 17));
lukas.highscores.push(new Highscore("jetzt", 11));

var michael = new Player("Michael");
michael.highscores.push(new Highscore("jetzt", 4));
michael.highscores.push(new Highscore("jetzt", 18));
michael.highscores.push(new Highscore("jetzt", 22));

var highscores_players_obj = [peter, markus, lukas, michael];

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
    console.log("--------------- JSON ausgeliefert");

    var result = [];
    var name;

    var result = [];
    for (var i = 0; i < highscores_players_obj.length; i++) {

      var obj = highscores_players_obj[i];

      var name = obj.name;

      for (var j = 0; j < obj.highscores.length; j++) {

        var highscore = obj.highscores[j];

        if (result.length == 0) {
          result.push({ name: name, score: highscore.score });
        } else {
          var position_to_insert = 0;
          for (var r = 0; r < result.length; r++) {
            if (highscore.score < result[r].score) {
              position_to_insert = r + 1;
            } else {
              break;
            }
          }
          result.splice(position_to_insert, 0, { name: name, score: highscore.score });
        }
      }
    }

    res.json(result);
  } else {
    console.log("--------------- HTML ausgeliefert");
    res.render('highscores', { highscores: highscores_players_obj });
  }
});

app.post('/highscores', urlencodedParser, function (req, res) {
  req.accepts('application/json');

  var found = false;
  highscores_players_obj.forEach(function (player) {
    if (req.body.name == player.name) {
      // found player
      found = true;
      player.highscores.push(new Highscore(Date.now(), req.body.score));
    }
  });

  if (!found) {
    /* Add as new Player */
    var player = new Player(req.body.name);
    player.highscores.push(new Highscore(Date.now(), req.body.score));
    highscores_players_obj.push(player);
  }

  res.json(highscores_players_obj);
});

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