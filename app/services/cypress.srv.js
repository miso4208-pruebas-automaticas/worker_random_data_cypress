'use strict'
const shell = require('shelljs');
var http = require('http');
const request = require('request');
const fs = require('fs');
const s3 = require('../../worker-sqs/s3Storage.js')

module.exports.generateCypress = function(req,success,error){

    shell.exec('npm install');
    shell.exec('npx cypress run');
    
}

module.exports.generateDynamicData = function(req,success,error){
    shell.exec('npm install');  
    let itemsEx = req.numberExecution;
    let path = req.path_project;
    let code = req.code;
    const codeinit = req.code;
    var item = 1;
    for(var i = 0,p = Promise.resolve();i<itemsEx;i++){
        p= p.then(_ => new Promise(resolve => {
         code = `${codeinit}_${item}`;
        requestcall(path,code,req,codeinit).then(()=>{
                shell.exec('npx cypress run', function(val, stdout, stderr) {
                            fs.readdir(`${path}/cypress/report/s3`,function(err, items) {
                                let file;
                                for(i=0;i<items.length;i++){
                                    if(items[i].includes('html')){
                                        file = items[i];
                                        break;
                                    }
                                }
                                const content = fs.readFileSync(`${path}/cypress/report/s3/${file}`);
                                s3.saveFileToS3(`${code}`,content,()=>{ 
                                    for(i=0;i<items.length;i++){
                                        if(items[i].includes('html')){
                                            fs.unlinkSync(`${path}/cypress/report/s3/${items[i]}`);
                                        }
                                    }
                                    if(item == itemsEx){
                                        success("ok");
                                    }else{
                                    item = item+1;
                                    resolve();
                                    }
                                });
                            });
                });
            });
        }))
        
        
 
    }
  
    
}

   
    function requestcall(path_project,code,req,codeinit) {
       return new Promise(function(resolve, reject) {
            request('http://my.api.mockaroo.com/users/1.json?key=ec487890', function (error, response, body) {
                console.log(body);
            fs.writeFile(`${path_project}/app/data.json`, body, function (err) {
                let insert = "INSERT INTO `hangover`.`EXECUTION_TESTS` (`code`, `id_application`, `type_application_name`, `level_name`, `type_name`, `type_execution_name`, `number_executions`, `execution_time`, `repetitions`, `status`,`parent`)" 
                            +  "VALUES ('" + `${code}` + "', '" + req.aplication + "', '" + req.typeAplication + "', '" + req.level + "', '" + req.type + "', '" + req.subType + "', '" + req.numberExecution + "', '" + req.executionTime + "', '" + req.repetitions + "', '" + req.status + "','" + codeinit + "');";
                        console.log(insert);
                        db.query(insert, (err, result) => {
                            if (err) throw error;
                            s3.saveFileToS3(`${code}_semilla`,body,()=>{ 
                                console.log('Archivo creado en S3 json data: ',`${code}_semilla`);
                                resolve("ok");
                            });
                        });
            
            }); 
       
          });
        });
        
    }
