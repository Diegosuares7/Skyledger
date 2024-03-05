import { Workbook } from 'exceljs';

export interface ProcessedExcelFile {
  fileName: string;
  workbook: Workbook;
  s3Url?: string;
}
