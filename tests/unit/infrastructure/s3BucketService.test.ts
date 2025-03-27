/* eslint-disable import/first */
import { Readable } from "stream";

process.env.LOG_LEVEL = 'error';
const mockPromise = jest.fn();
const mockGetObject = jest.fn(() => ({
  promise: mockPromise,
}));
const mockUpload = jest.fn();
const mockS3 = jest.fn(() => ({
  upload: mockUpload,
  getObject: mockGetObject,
}));
import {
  S3Client,
  GetObjectCommand,
  GetObjectCommandOutput,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { readAndUpsert } from '../../../src/infrastructure/s3BucketService';

jest.mock('aws-sdk', () => ({
  S3: mockS3,
}));
const client = mockClient(S3Client);
describe('readAndUpsert', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    client.reset();
  });
  it('should read the file, return the value in the file and update the stored value', async () => {
    const fileName = 'a_file_with_a_date.txt';
    const originalFileContents = 'the original content of the file';
    const newFileContents = 'new content for the file';

    client.on(GetObjectCommand).resolves({ Body: Readable.from(Buffer.from(originalFileContents)) } as unknown as GetObjectCommandOutput);
    client.on(PutObjectCommand).callsFake(mockUpload);

    const contents = await readAndUpsert(fileName, newFileContents);
    expect(contents).toEqual(originalFileContents);
    expect(mockUpload).toHaveBeenCalledWith(
      expect.objectContaining({ Key: fileName, Body: newFileContents }),
      expect.anything(),
    );
  });
  it.each([404, 403])('it should create a new file the the content and return the new content', async (statusCode) => {
    const fileName = 'a_file_with_a_date.txt';
    const newFileContents = 'new content for the file';
    const valueIfNotFound = 'a week ago';

    client.on(GetObjectCommand).rejects({ statusCode } as unknown as GetObjectCommandOutput);
    client.on(PutObjectCommand).callsFake(mockUpload);

    const contents = await readAndUpsert(fileName, newFileContents, valueIfNotFound);
    expect(contents).toEqual(valueIfNotFound);
    expect(mockUpload).toHaveBeenCalledWith(
      expect.objectContaining({ Key: fileName, Body: newFileContents }),
      expect.anything(),
    );
  });
});
