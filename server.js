var async = require('async');
var express = require('express');
var bodyParser = require('body-parser');
var r = require('rethinkdb');

var config = require(__dirname + '/config.js');

var app = express();

// For serving the index.html and all the other front-end assets.
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

// Routes
app.route('/list').get(listTvShows);

app.route('/create')
  .get(createTvShow)
  .post(createTvShow);

// If we reach this middleware the route could not be handled and must be unknown.
app.use(handle404);

// Generic error handling middleware.
app.use(handleError);

function listTvShows(req, res, next) {

  //res.set('Accept', 'application/json');

  // When you refresh it, if disable cache is not active on devtools,
  // you will loose content-type on Reponse headers.
  // Both of the above code is working
  // res.set('Content-Type', 'application/json; charset=utf-8');
  res.type('application/json');

  r.table('tv_shows').run(req.app._rdbConn, function (err, cursor) {
    if (err) throw err;
    cursor.toArray(function (err, result) {
      if (err) throw err;

      res.json(result);

    });
  });
}

function createTvShow(req, res, next) {
  // var postData = req.body;

  r.table('tv_shows').insert({ name: 'Peaky Blinders 2' }, { returnChanges: true })
  .run(req.app._rdbConn, function (err, result) {
    if (err) throw err;
    res.json(result.changes[0].new_val);
  });
}

function handle404(req, res, next) {
  res.status(404).end('not found');
}

function handleError(err, req, res, next) {
  console.log(err.stack);
  res.status(500).json({ err: err.message });
}

function startExpress(connection) {
  app._rdbConn = connection;
  app.listen(3000);
  console.log('Listening on port ' + 3000);
}

async.waterfall([
  function connect(callback) {
    r.connect(config.rethinkdb, callback);
  },

  function createDatabase(connection, callback) {
    r.dbList().contains(config.rethinkdb.db).do(function (containsDb) {
      return r.branch(
        containsDb,
        { created: 0 },
        r.dbCreate(config.rethinkdb.db)
      );
    }).run(connection, function (err) {
      callback(err, connection);
    });
  },

  function createTable(connection, callback) {
    r.tableList().contains('tv_shows').do(function (containsTable) {
      return r.branch(
        containsTable,
        { created: 0 },
        r.tableCreate('tv_shows')
      );
    }).run(connection, function (err) {
      callback(err, connection);
    });
  },

], function (err, connection) {
  if (err) {
    console.log(err);
    process.exit(1);
    return;
  }

  startExpress(connection);
});
