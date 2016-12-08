var Promise = require('es6-promise').Promise;

var gulp = require('gulp');

var nodemon = require('nodemon');

gulp.task('express-server', function (cb) {
  nodemon({
    script: 'index.js', //server.js
    ext: 'js html',
    env: { NODE_ENV: 'development' },
  });
});
