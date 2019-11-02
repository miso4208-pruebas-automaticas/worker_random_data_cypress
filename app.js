'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();

var cypressController = require('./app/controllers/cypress.ctrl.js');

const port = 8007;

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
