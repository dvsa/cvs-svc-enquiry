import AWS from 'aws-sdk';

export function uploadToS3(evlFeedProcessedData: string, fileName: string) {
  let s3 = configureS3();
  const params = { Bucket: process.env.AWS_S3_BUCKET_NAME, Key: fileName, Body: evlFeedProcessedData };

  console.log(`uploading ${fileName} to S3`);
  s3.upload(params, (err) => {
    if(err){
      console.log(err);
    }
  })
}

function configureS3() {
  if (process.env.IS_OFFLINE === 'true') {
    return new AWS.S3({
      s3ForcePathStyle: true,
      accessKeyId: "S3RVER", // This specific key is required when working offline
      secretAccessKey: "S3RVER",
      endpoint: 'http://localhost:4569'
    });
  } else {
    return new AWS.S3();
  }
}
