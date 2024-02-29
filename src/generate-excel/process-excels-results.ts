import { Workbook } from 'exceljs';
import { ProcessResponseEnum } from '../entities/process-response/process-response.entity';
import { SAPExcelFileResult } from '../entities/sap-transformer/excel/sap-excel-file-result.interface';
import { createExcelFile } from './generate-excel';

export async function processExcelsResults(excelsResults: SAPExcelFileResult[]): Promise<Workbook[]> {
  const excelFiles: Workbook[] = [];

  for (const result of excelsResults) {
    if (result.status !== ProcessResponseEnum.ERROR && result.file) {
      const excelFile = createExcelFile(result.file.rows);
      excelFiles.push(excelFile);
    }
  }

  return excelFiles;
}
