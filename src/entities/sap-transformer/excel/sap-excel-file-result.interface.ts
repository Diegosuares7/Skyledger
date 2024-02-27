import { ProcessResponseEnum } from '../../process-response/process-response.entity';
import { SAPExcelFile } from './sap-excel-file.interface';

export interface SAPExcelFileResult {
  file?: SAPExcelFile;
  status: ProcessResponseEnum;
  errorMessage?: string;
}
