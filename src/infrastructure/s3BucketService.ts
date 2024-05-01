import {
  GetObjectCommand,
  GetObjectCommandInput,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import logger from '../utils/logger';

export async function uploadToS3(processedData: string, fileName: string, callback: () => void): Promise<void> {
  const s3: S3Client = configureS3();
  const params = { Bucket: process.env.AWS_S3_BUCKET_NAME ?? '', Key: fileName, Body: processedData };
  try {
    logger.info(`uploading ${fileName} to S3`);
    await s3.send(new PutObjectCommand(params));
  } catch (err) {
    logger.error(err);
  }
  callback();
}

export async function getItemFromS3(key: string): Promise<string | undefined> {
  logger.info(`Reading contents of file ${key}`);
  const s3 = configureS3();
  const params: GetObjectCommandInput = { Bucket: process.env.AWS_S3_BUCKET_NAME ?? '', Key: key };
  try {
    const body = (await s3.send(new GetObjectCommand(params))).Body?.toString();
    logger.info(`File contents retrieved: ${body}`);
    return body;
  } catch (err) {
    logger.error(`Error reading file from S3 ${JSON.stringify(err)}`);
    throw err;
  }
}

export async function readAndUpsert(key: string, body: string, valueIfNotFound?: string): Promise<string> {
  logger.debug('Reading of creating file if not exits');
  const cb = () => {
    logger.info(`Upserted ${key} in S3`);
  };
  try {
    const contents = await getItemFromS3(key);
    await uploadToS3(body, key, cb);
    return contents ?? '';
  } catch (err) {
    // the "not found" status code depends on if the lambda has the s3:ListObjects permission, adding both to be safe
    const notFoundStatusCode = [403, 404];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (notFoundStatusCode.includes(err.statusCode)) {
      logger.debug('Creating missing file');
      await uploadToS3(body, key, cb);
      return valueIfNotFound ?? body;
    }
    logger.error(`Error occured when upserting file ${JSON.stringify(err)}`);
    throw new Error('Error creating file');
  }
}

function configureS3() {
  if (process.env.IS_OFFLINE === 'true') {
    logger.debug('configuring s3 using serverless');
    return new S3Client({
      // The key s3ForcePathStyle is renamed to forcePathStyle.
      forcePathStyle: true,

      credentials: {
        // This specific key is required when working offline
        accessKeyId: 'S3RVER',

        secretAccessKey: 'S3RVER',
      },

      // The transformation for endpoint is not implemented.
      // Refer to UPGRADING.md on aws-sdk-js-v3 for changes needed.
      // Please create/upvote feature request on aws-sdk-js-codemod for endpoint.
      endpoint: 'http://localhost:4569',
    });
  }
  return new S3Client({});
}
