import AWS from 'aws-sdk';
import { readFileSync } from 'fs';

export function uploadToS3(filePath: string) {
  const fileData: string = readFileSync(filePath, { encoding: 'utf-8' });
  const s3 = new AWS.S3();
  const params = { Bucket: '', Key: filePath, Body: fileData };
  s3.upload(params, (err, data) => {
    console.log(err, data);
  });
}
