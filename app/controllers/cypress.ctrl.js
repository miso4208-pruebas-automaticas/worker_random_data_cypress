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

router.post('/cypress-generatedata',function(req,res){
    
    console.log("data: "+ JSON.stringify(req.body))
    
    let data={
        'items' : req.body.items
    }

    cypressService.generateDynamicData(data,function(apps){
        res.statusCode = 200;
        res.send({ status: "OK", data:apps });
    },function(err){
        res.statusCode = 404;
        res.send(err);

    })

    return res;
});


module.exports = router;
