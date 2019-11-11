var AWS = require('aws-sdk');
var cypressService = require('../app/services/cypress.srv.js');

AWS.config.update({region:'us-east-1',  
accessKeyId:process.env.ACCES_KEY_ID_SQS,
secretAccessKey:process.env.SECRET_ACCESS_KEY_SQS});

var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const sqsUrl = 'https://sqs.us-east-1.amazonaws.com/669213563582/worker-cypress-mockaro.fifo'; // CAMBIAR POR URL SQS DE ACUERDO A TIPO DE PRUEBA

module.exports.getSqs = function(req,success,error){
    console.log("sqs init ..")
    var params = {
      AttributeNames: [
        'SentTimestamp'
      ],
      MaxNumberOfMessages: 1,
      MessageAttributeNames: [
        'All'
      ],
      QueueUrl: sqsUrl,
      VisibilityTimeout: 300,
      WaitTimeSeconds: 20
    };
     
    sqs.receiveMessage(params, function(err, data) {
      if (err) {
        console.log('Error', err);
      } else if (data.Messages) {
        let payload = JSON.parse(data.Messages[0].Body);
       
        executeService(payload,() => {
            console.log('ok test '+data.Messages[0].ReceiptHandle);
            sqsComplete(data.Messages[0].ReceiptHandle,payload.code);
            console.log("Proceso completo test");
          },
          (msg) =>{
            console.log('error test: ',msg);
          });
        
      }
    });

  };

  executeService = (req, success,error)=>{
    cypressService.generateDynamicData(req, function(apps){ //LLAMAR AL SERVICIO QUE SE EJECUTABA DESDE EL CONTROLADOR VALIDAR PARAMETROS
        success({ status: "OK" });
    },function(err){
        error(err);
        
    })
  }

  updateBD = (code)=>{
    let update = `UPDATE hangover.EXECUTION_TESTS SET status=1 WHERE code="${code}"`;
    console.log(update);
    db.query(update, (err, result) => {
        if (err) throw err;
       console.log(result);
    });
  }

  const sqsComplete = (handle,code) => {
    var deleteParams = {
      QueueUrl: sqsUrl,
      ReceiptHandle: handle
    };
    sqs.deleteMessage(deleteParams, function(err, data) {
      if (err) {
        console.log('Delete Error', err);
      } else {
        updateBD(code);
        console.log('Message Deleted', data);
      }
    });
  };
  