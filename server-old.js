var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var r = require('rethinkdb');

var connection = null;
r.connect({ host: 'localhost', port: 28015 }, function (err, conn) {
  if (err) throw err;
  connection = conn;
});

app.get('/createdb', function (req, res) {
  r.db('test').tableCreate('tv_shows').run(connection, function (err, res) {
    if (err) throw err;
    console.log(res);
    r.table('tv_shows').insert({ name: 'Star Trek TNG' }).run(connection, function (err, res)
    {
      if (err) throw err;
      console.log(res);
    });
  });
});

app.get('/insert', function (req, res) {
  r.table('tv_shows').insert({ name: 'Peaky Blinders 2' }).run(connection, function (err, res) {
    if (err) throw err;
    console.log(res);
  });
});

app.get('/get', function (req, res) {

  r.table('tv_shows').run(connection, function (err, cursor) {
    if (err) throw err;
    cursor.toArray(function (err, result) {
      if (err) throw err;
      res.send(JSON.stringify(result, null, 2));
    });
  });
});

app.get('/get-single', function (req, res) {

  // r.table('authors').filter(r.row('name').eq("Star Trek TNG")).
  r.table('tv_shows').get('b4966d01-d0cc-48e9-acef-d6b43770ec16').
    run(connection, function (err, result) {
      if (err) throw err;
      res.send(JSON.stringify(result, null, 2));
    });
});

app.get('/realtime', function (req, res) {
  r.table('tv_shows').changes().run(connection, function (err, cursor) {
    if (err) throw err;
    cursor.each(function (err, row) {
      if (err) throw err;
      res.send(JSON.stringify(row, null, 2));
    });
  });
});

app.listen(3000, function () {
  console.log('3000');
});
