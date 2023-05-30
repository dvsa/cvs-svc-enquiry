/* eslint-disable import/first */
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
import { readAndUpsert } from '../../../src/infrastructure/s3BucketService';

jest.mock('aws-sdk', () => ({
  S3: mockS3,
}));

describe('readAndUpsert', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should read the file, return the value in the file and update the stored value', async () => {
    const fileName = 'a_file_with_a_date.txt';
    const originalFileContents = 'the original content of the file';
    const newFileContents = 'new content for the file';

    mockPromise.mockResolvedValueOnce({ Body: Buffer.from(originalFileContents) });

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

    mockPromise.mockRejectedValueOnce({ statusCode });

    const contents = await readAndUpsert(fileName, newFileContents, valueIfNotFound);
    expect(contents).toEqual(valueIfNotFound);
    expect(mockUpload).toHaveBeenCalledWith(
      expect.objectContaining({ Key: fileName, Body: newFileContents }),
      expect.anything(),
    );
  });
});
