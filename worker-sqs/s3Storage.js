var AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.ACCES_KEY_ID_S3,
  secretAccessKey: process.env.SECRET_ACCESS_KEY_S3
});

const s3 = new AWS.S3({
  apiVersion: '2006-03-01'
});
const bucketname= 'reports-cypress-mockaro-testing' //CAMBIAR POR NOMBRE DE BUCKET DE ACUERDO A TIPO DE PRUEBA

module.exports.saveFileToS3 = (code, file, success) => {
  
  s3.createBucket({
    Bucket: bucketname
  }, function (err, data) {
    if (err) {
      console.log("error de bucket: ",err);
      return 0;
    }
    if(!s3.getBucketCors.data){
      configureCors(bucketname);
    }
    let params = {
      Bucket: bucketname,
      Key: `${code}.html`,
      Body: file,
      CacheControl:"max-age=0,no-cache,no-store,must-revalidate",
      ContentType:"text/html",
      ACL:"public-read"
    };
    s3.putObject(params, function (err, data) {
      if (err) {
        console.log(err);
        success(err);
        return 0;
      }
        updateUrlReport(code,`https://${bucketname}.s3.amazonaws.com/${code}.html`);
      console.log('HTML creado exitosamente: '+`https://${bucketname}.s3.amazonaws.com/${code}.html`);
      success();
    });
    //listBucketKeys(code);

  });
}

updateUrlReport = (code,url_report)=>{
  let update;
  if(code.includes('semilla'))
      update = `UPDATE hangover.EXECUTION_TESTS SET url_semilla="${url_report}" WHERE code="${code.split('_semilla')[0]}"`;
  else{
     update = `UPDATE hangover.EXECUTION_TESTS SET url_report="${url_report}", status="1" WHERE code="${code}"`;
  }
    console.log("report->"+update);
  db.query(update, (err, result) => {
      if (err) throw error;
     console.log(result);
  });
}

const configureCors = (bucket)=>{
  var params = {
    Bucket: bucket, 
    CORSConfiguration: {
     CORSRules: [
        {
       AllowedHeaders: [
          "*"
       ], 
       AllowedMethods: [
          "PUT", 
          "POST", 
          "DELETE"
       ], 
       AllowedOrigins: [
          "*"
       ], 
       ExposeHeaders: [
          "x-amz-server-side-encryption"
       ], 
       MaxAgeSeconds: 3000
      }, 
        {
       AllowedHeaders: [
          "Authorization"
       ], 
       AllowedMethods: [
          "GET"
       ], 
       AllowedOrigins: [
          "*"
       ], 
       MaxAgeSeconds: 3000
      }
     ]
    }, 
    ContentMD5: ""
   };
   s3.putBucketCors(params, function(err, data) {
     if (err) console.log(err, err.stack); 
   });

}

const listBucketKeys = (key)=>{
  var split = key.split('/');
  var raiz = split[0];
  let params={
    Bucket: bucketname,
    Prefix: raiz,
  }
  s3.listObjectsV2(params,function(err,data){
    if (err) console.log(err, err.stack); 
    else     console.log(data); 
  });
}

