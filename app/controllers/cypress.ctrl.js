'use strict'
var express = require('express')
var router = express.Router();
var cypressService = require('../services/cypress.srv.js');
var http = require('http');

router.post('/cypress_random_data',function(req,res){
    
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
