const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: 'secret',
  algorithms: ['HS256'],
};

// get authorization header from jwt.io
// when you need request you need to change http-headers with
// authorization: JWT  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ

passport.use(new JwtStrategy(jwtOptions, function (jwtPayload, done) {
  done(null, { name: jwtPayload.name });
}));

const customRouter = require('./routers/custom');

const app = express();
const server = http.createServer(app);

app.use(passport.authenticate('jwt', { session: false }));
app.use('/api', bodyParser.json());
app.use('/api', customRouter);

server.listen(3000, function () {
  console.log('rest service is running on port 3000');
});
