const express = require('express');
const cors = require('cors');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { readdirSync } = require('fs');
const bodyParser = require('body-parser');


const csrfProtection = csrf({ cookie: true });

const app = express();
require('./src/api/v1/config').dbConnection();

app.use(function(req, res, next) {
  var contentType = req.headers['content-type'] || ''
    , mime = contentType.split(';')[0];

  if (mime != 'application.json') {
    return next();
  }

  var data = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
    data += chunk;
  });
  req.on('end', function() {
    req.rawBody = data;
    next();
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(cookieParser());
app.use(morgan('dev'));

// app.use(csrfProtection);

readdirSync('./src/api/v1/routes').map((route) =>
  app.use(`/api/${route.split(".")[0]}`, require(`./src/api/v1/routes/${route}`)
  )
);

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: '' });
});

module.exports = app;
