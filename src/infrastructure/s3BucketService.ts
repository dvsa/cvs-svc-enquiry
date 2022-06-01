import AWS from 'aws-sdk';
import { readFileSync } from 'fs';
import { removeFile } from './IOService';

export function uploadToS3(filePath: string) {
  const fileData: string = readFileSync(filePath, { encoding: 'utf-8' });
  const s3 = new AWS.S3();
  const params = { Bucket: process.env.AWS_S3_BUCKET_NAME, Key: filePath, Body: fileData };
  s3.upload(params, (err: Error, data) => {
    if (data) {
      removeFile(filePath);
    }
    if (err) {
      throw err;
    }
  });
}
