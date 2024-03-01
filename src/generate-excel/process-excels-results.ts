import { ProcessResponseEnum } from '../entities/process-response/process-response.entity';
import { SAPExcelFileResult } from '../entities/sap-transformer/excel/sap-excel-file-result.interface';
import { createExcelFile } from './generate-excel';
import { ProcessedExcelFile } from '../entities/excel/processed-excel-file';

export async function processExcelsResults(excelsResults: SAPExcelFileResult[]): Promise<ProcessedExcelFile[]> {
  const processedExcelFiles: ProcessedExcelFile[] = [];

  for (const result of excelsResults) {
    if (result.status !== ProcessResponseEnum.ERROR && result.file) {
      const excelFile = createExcelFile(result.file.rows);

      const processedExcelFile: ProcessedExcelFile = {
        fileName: result.file.fileName,
        workbook: excelFile,
      };

      processedExcelFiles.push(processedExcelFile);
    }
  }

  return processedExcelFiles;
}
