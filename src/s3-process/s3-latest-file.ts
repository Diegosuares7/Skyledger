import * as AWS from 'aws-sdk';
import { handleStepError } from '../exceptions/step-error.handler';
import { PROCESS_STEPS } from '../exceptions/steps.constants';
import 'dotenv/config';
import { FileNotFoundException } from './exceptions/file-not-found.exception';
import { configureS3 } from './s3-credentials';

export async function getLatestFile(folderInS3: string): Promise<string> {
  const s3 = configureS3();
  const bucketName = process.env.AWS_BUCKET_NAME as string;

  try {
    const response = await s3.listObjectsV2({ Bucket: bucketName, Prefix: folderInS3 }).promise();
    const sortedObjects = response.Contents?.sort(
      (a: AWS.S3.Object, b: AWS.S3.Object) => (b.LastModified?.getTime() || 0) - (a.LastModified?.getTime() || 0),
    );
    if (!sortedObjects || sortedObjects.length === 0) {
      throw new FileNotFoundException();
    }

    const latestFileKey = sortedObjects[0].Key as string;
    const getObjectParams: AWS.S3.GetObjectRequest = {
      Bucket: bucketName,
      Key: latestFileKey,
    };

    const s3Object = await s3.getObject(getObjectParams).promise();
    const xmlData = s3Object.Body?.toString('utf-8') || '';

    return xmlData;
  } catch (error) {
    throw handleStepError(error, PROCESS_STEPS.XML_PARSE);
  }
}
