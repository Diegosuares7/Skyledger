import { ProcessResponseEnum } from '../entities/process-response/process-response.entity';
import { SAPExcelFileResult } from '../entities/sap-transformer/excel/sap-excel-file-result.interface';
import Logger from '../configurations/config-logs/winston.logs';
import { PROCESS_STEPS } from '../exceptions/steps.constants';
import { configureS3 } from './s3-credentials';

export async function uploadExcelsToS3(
  processedExcelFiles: SAPExcelFileResult[],
  folderName: string,
): Promise<SAPExcelFileResult[]> {
  const s3 = configureS3();
  const bucketName = process.env.AWS_BUCKET_NAME as string;

  await Promise.all(
    processedExcelFiles.map(async (excelFileResult) => {
      try {
        const processedExcelFile = excelFileResult.excelFile;
        if (!processedExcelFile) {
          return;
        }
        const excelFile = processedExcelFile.workbook;
        const excelBuffer = await excelFile.xlsx.writeBuffer();

        const fileName = `${folderName}/${processedExcelFile.fileName}`;

        const params = {
          Bucket: bucketName,
          Key: fileName,
          Body: excelBuffer,
          ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        };

        const s3Upload = await s3.upload(params).promise();
        processedExcelFile.s3Url = s3Upload.Location;
        Logger.info(`Successfully ${PROCESS_STEPS.UPLOAD_EXCEL_FILES}`);
      } catch (error) {
        Logger.error(`Error: ${PROCESS_STEPS.UPLOAD_EXCEL_FILES}:`, error);
        excelFileResult.status = ProcessResponseEnum.ERROR;
        excelFileResult.errorMessage = (error as Error).message;
      }
    }),
  );

  return processedExcelFiles;
}
