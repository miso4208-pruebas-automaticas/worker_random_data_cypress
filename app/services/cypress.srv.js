'use strict'
const shell = require('shelljs');

module.exports.generateCypress = function(req,success,error){

    shell.exec('npm install');
    shell.exec('npx cypress run');

}
