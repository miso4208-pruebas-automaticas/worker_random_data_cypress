'use strict'
var express = require('express')
var router = express.Router();
var cypressService = require('../services/cypress.srv.js');
var http = require('http');

router.get('/cypress',function(req,res){
    
    cypressService.generateCypress(function(apps){
        res.statusCode = 200;
        res.send({ status: "OK" });
    },function(err){
        res.statusCode = 404;
        res.send(err);

    })

    return res;
});

module.exports = router;
