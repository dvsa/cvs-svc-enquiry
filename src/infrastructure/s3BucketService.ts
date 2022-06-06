import AWS from 'aws-sdk';
import { createReadStream } from 'fs';
import { createGzip } from 'zlib';
import { removeFile } from './IOService';

export function uploadToS3(fileName: string) {
  const filePath = `/tmp/${fileName}`;
  const fileData = createReadStream(filePath, { encoding: 'utf-8' }).pipe(createGzip());
  const s3 = new AWS.S3();
  const params = { Bucket: process.env.AWS_S3_BUCKET_NAME, Key: fileName, Body: fileData };
  console.log(`uploading ${fileName} to S3`);
  s3.upload(params, (err, data) => {
    console.log(err, data);
    removeFile(filePath);
  })
  .on('httpUploadProgress', (evt) => {
    console.log('Progress:', evt.loaded, '/', evt.total);
  });
}
