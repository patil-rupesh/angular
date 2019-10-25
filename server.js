require('./config/config');
require('./models/db');

const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

const userRoute = require('./routes/user.route');
const clientRoute = require('./routes/client.route');

var app = express();
app.use(cookieParser());
app.use(
  session({
    name: 'sid',
    resave: false,
    saveUninitialized: false,
    secret: 'it is a secret!',
    cookie: {
      maxAge: 1000 * 60 * 60 * 2 
    }
  })
);

// middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/user', userRoute);
app.use('/client', clientRoute);

app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    var valErrors = [];
    Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
    res.status(422).send(valErrors)
  }
  else {
    console.log(err);
  }
});

// start server
app.listen(process.env.PORT, () => console.log(`Server started at port : ${process.env.PORT}`));
