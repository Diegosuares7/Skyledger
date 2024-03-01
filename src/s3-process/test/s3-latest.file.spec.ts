import { FileNotFoundException } from '../exceptions/file-not-found.exception';
import { getLatestFile } from '../../s3-process/s3-latest-file';
import AWS from 'aws-sdk';

describe('getLatestFile', () => {
  it('should throw FileNotFoundException when the S3 folder is empty', async () => {
    // Mock AWS.S3.listObjectsV2 to return an empty response
    const mockListObjectsV2 = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        Contents: [],
      }),
    });
    AWS.S3.prototype.listObjectsV2 = mockListObjectsV2;

    // Call the function and expect it to throw FileNotFoundException
    await expect(getLatestFile('emptyFolder')).rejects.toThrow(FileNotFoundException);
    expect(mockListObjectsV2).toHaveBeenCalledWith({ Bucket: 'aws-glue-jetsmart', Prefix: 'emptyFolder' });
  });
});
