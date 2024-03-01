import { handleStepError } from '../exceptions/step-error.handler';
import { ProcessedExcelFile } from '../entities/excel/processed-excel-file';
import { configureS3 } from './s3-credentials';
import { PROCESS_STEPS } from '../exceptions/steps.constants';

export async function uploadExcelsToS3(processedExcelFiles: ProcessedExcelFile[], folderName: string): Promise<void> {
  const s3 = configureS3();
  const bucketName = process.env.AWS_BUCKET_NAME as string;

  for (const processedExcelFile of processedExcelFiles) {
    const excelFile = processedExcelFile.workbook;
    const excelBuffer = await excelFile.xlsx.writeBuffer();

    const fileName = `${folderName}/${processedExcelFile.fileName}`;

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: excelBuffer,
      ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };

    try {
      await s3.upload(params).promise();
    } catch (error) {
      throw handleStepError(error, PROCESS_STEPS.UPLOAD_EXCEL_FILES);
    }
  }
}
