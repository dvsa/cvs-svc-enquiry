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

export async function getLastAlphabeticalItemByPrefix(prefix: string): Promise<string> {
  logger.info(`Getting latest file uploaded for prefix ${prefix}`);
  const s3 = configureS3();
  const params: AWS.S3.ListObjectsV2Request = { Bucket: process.env.AWS_S3_BUCKET_NAME, Prefix: prefix };
  return getByPrefix(s3, params);
}

async function getByPrefix(s3: AWS.S3, params: AWS.S3.ListObjectsV2Request, allItems: string[] = []): Promise<string> {
  const response = await s3.listObjectsV2(params).promise();
  response.Contents.forEach((item) => allItems.push(item.Key));
  if (response.NextContinuationToken) {
    params.ContinuationToken = response.NextContinuationToken;
    await getByPrefix(s3, params, allItems);
  }
  allItems.reverse();
  return allItems[0];
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
