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

app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf
  },
  limit : "5mb"
}));
app.use(express.urlencoded({ extended: false , limit: '5mb'}));
// app.use(cors());

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
