import AWS from 'aws-sdk';
import logger from '../utils/logger';

export function uploadToS3(processedData: string, fileName: string, callback: () => void): void {
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
  try {
    const body = (await s3.getObject(params).promise()).Body.toString();
    logger.info(`File contents retrieved: ${body}`);
    return body;
  } catch (err) {
    logger.error(`Error reading file from S3 ${JSON.stringify(err)}`);
    throw err;
  }
}

export async function readAndUpsert(key: string, body: string): Promise<string> {
  logger.debug('Reading of creating file if not exits');
  const cb = () => {
    logger.info(`Upserted ${key} in S3`);
  };
  try {
    const contents = await getItemFromS3(key);
    uploadToS3(body, key, cb);
    return contents;
  } catch (err) {
    // the "not found" status code depends on if the lambda has the s3:ListObjects permission, adding both to be safe
    const notFoundStatusCode = [403, 404];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (notFoundStatusCode.includes(err.statusCode)) {
      logger.debug('Creating missing file');
      uploadToS3(body, key, cb);
      return body;
    }
    logger.error(`Error occured when upserting file ${JSON.stringify(err)}`);
    throw new Error('Error creating file');
  }
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
