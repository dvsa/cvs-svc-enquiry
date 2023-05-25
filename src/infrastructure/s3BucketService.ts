import AWS from 'aws-sdk';
import logger from '../utils/logger';

export function uploadToS3(processedData: string, fileName: string, callback: () => void) {
  const s3 = configureS3();
  const params = { Bucket: process.env.AWS_S3_BUCKET_NAME, Key: fileName, Body: processedData };

  logger.info(`uploading ${fileName} to S3`);
  s3.upload(params, (err) => {
    if (err) {
      logger.error(err);
    }
    callback();
  });
}

export async function getItemFromS3(key: string): Promise<string> {
  logger.info(`Reading contents of file ${key}`);
  const s3 = configureS3();
  const params: AWS.S3.GetObjectRequest = { Bucket: process.env.AWS_S3_BUCKET_NAME, Key: key };
  return (await s3.getObject(params).promise()).Body.toString();
}

function configureS3() {
  if (process.env.IS_OFFLINE === 'true') {
    logger.debug('configuring s3 using serverless');
    return new AWS.S3({
      s3ForcePathStyle: true,
      accessKeyId: 'S3RVER', // This specific key is required when working offline
      secretAccessKey: 'S3RVER',
      endpoint: 'http://localhost:4569',
    });
  }
  return new AWS.S3();
}
