'use strict'
const shell = require('shelljs');
var http = require('http');
const request = require('request');
const fs = require('fs');

module.exports.generateCypress = function(req,success,error){

    shell.exec('npm install');
    shell.exec('npx cypress run');
    
}

module.exports.generateDynamicData = function(req,success,error){
    shell.exec('npm install');  
    let items = req.items;
    var item = 1;
    for(var i = 0,p = Promise.resolve();i<items;i++){
        p= p.then(_ => new Promise(resolve => {
        requestcall().then(()=>{
                shell.exec('npx cypress run', function(code, stdout, stderr) {
                    console.log("--- "+ item + "items " +items);
                    if(item == items){
                        success("ok");
                    }
                    item = item+1;
                    resolve();
                });
            });
        }))
        
        
 
    }
  
    
}

function requestGeneral(){
    requestcall().then(()=>{
        shell.exec('npx cypress run', function(code, stdout, stderr) {
            item++;
            return item;
        });
    })
}
   
    function requestcall() {
        return new Promise(function(resolve, reject) {
            request('http://my.api.mockaroo.com/users/1.json?key=ec487890', function (error, response, body) {
                console.log(body);
            fs.writeFile(`/Users/adrianabonilla/Documents/andes/pruebas/project/workerWebCypress/app/data.json`, body, function (err) {
              console.log("antes")
              resolve("ok");
            
            }); 
       
          });
        });
        
    }

//     http.get('http://my.api.mockaroo.com/users/1.json?key=ec487890', (res) => {
//   const { statusCode } = res;
//   const contentType = res.headers['content-type'];

//   let error;
//   if (statusCode !== 200) {
//     error = new Error('Request Failed.\n' +
//                       `Status Code: ${statusCode}`);
//   } else if (!/^application\/json/.test(contentType)) {
//     error = new Error('Invalid content-type.\n' +
//                       `Expected application/json but received ${contentType}`);
//   }
//   if (error) {
//     console.error(error.message);
//     // Consume response data to free up memory
//     res.resume();
//     return;
//   }

//   res.setEncoding('utf8');
//   let rawData = '';
//   res.on('data', (chunk) => { rawData += chunk; });
//   res.on('end', () => {
//     try {
//       const parsedData = JSON.parse(rawData);
//       console.log(parsedData);
//     } catch (e) {
//       console.error(e.message);
//     }
//   });
// }).on('error', (e) => {
//   console.error(`Got error: ${e.message}`);
// });

    // http.get('http://my.api.mockaroo.com/users/1.json?key=ec487890', function(res){
    //     var body = '';
    
    //     res.on('data', function(chunk){
    //         body += chunk;
    //     });
    //     console.log(JSON.stringify("......"+body))
    //     res.on('end', function(){
    //         var fbResponse = JSON.parse(body);
    //         console.log("Got a response: ", fbResponse.picture);
    //     });
    // }).on('error', function(e){
    //       console.log("Got an error: ", e);
    // });
        


