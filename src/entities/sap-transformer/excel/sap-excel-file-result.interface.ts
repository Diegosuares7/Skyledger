import { ProcessedExcelFile } from '../../../entities/excel/processed-excel-file';
import { ProcessResponseEnum } from '../../process-response/process-response.entity';
import { SAPExcelFile } from './sap-excel-file.interface';

export interface SAPExcelFileResult {
  file?: SAPExcelFile;
  status: ProcessResponseEnum;
  errorMessage?: string;
  excelFile?: ProcessedExcelFile;
}
