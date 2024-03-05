import { ProcessResponseEnum } from '../entities/process-response/process-response.entity';
import { SAPExcelFileResult } from '../entities/sap-transformer/excel/sap-excel-file-result.interface';
import { createExcelFile } from './generate-excel';
import { ProcessedExcelFile } from '../entities/excel/processed-excel-file';
import Logger from '../configurations/config-logs/winston.logs';
import { SAPExcelFile } from '../entities/sap-transformer/excel/sap-excel-file.interface';

export async function processExcelsResults(excelsResults: SAPExcelFileResult[]): Promise<SAPExcelFileResult[]> {
  const processedResults = excelsResults.map((result) => {
    try {
      if ([ProcessResponseEnum.ERROR_ROUNDING, ProcessResponseEnum.SUCCESS].includes(result.status) && result.file) {
        const processedExcelFile = createProcessedExcelFile(result.file);

        result.excelFile = processedExcelFile;
      }
      return result;
    } catch (e) {
      result.status = ProcessResponseEnum.ERROR;
      result.errorMessage = e.message;
      return result;
    }
  });

  Logger.info(`Successfully process excels results`);
  return processedResults;
}

function createProcessedExcelFile(file: SAPExcelFile): ProcessedExcelFile {
  const excelFile = createExcelFile(file.rows);

  return {
    fileName: file.fileName,
    workbook: excelFile,
  };
}
