const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const MongoClient = require('mongodb').MongoClient
const assert = require('assert');
const bodyParser = require('body-parser');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const url = 'mongodb://localhost:27017';
const dbName = 'bread';

MongoClient.connect(url, function (err, client) {
  assert.equal(null, err);
  if (err) throw err
  console.log("Connected successfully to server");

  const db = client.db(dbName);
  const indexRouter = require('./routes/index')(db);
  app.use('/', indexRouter);

  // client.close();
  
})








module.exports = app;
