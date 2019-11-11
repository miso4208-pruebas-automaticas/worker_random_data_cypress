'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();
var mysql = require('mysql'); 

var cypressController = require('./app/controllers/cypress.ctrl.js');

const port = 8007;

const db = mysql.createConnection ({ //CAMBIO ADICONAR CONEXION A BD
  host: 'hangover.cxelmrn7jq89.eu-west-1.rds.amazonaws.com',
  user: 'admin',
  password: 'admin2019',
  database: 'hangover'
});

db.connect((err) => {
  if (err) {
      throw err;
  }
  console.log('Connected to database');
});
global.db = db;

app.options('*', cors());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/test', [cypressController]);

app.use( function (req, res, next) {
    next();
});

var server =  app.listen(port, () => {
  console.log('Worker cypress listening on ' + port);
});

server.timeout = 5000000
