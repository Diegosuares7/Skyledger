import { SAPExcelRowError } from './sap-error-row.interface';
import { SAPExcelRow } from './sap-row.entity';

export interface SAPExcelFile {
  fileName: string;
  rows: SAPExcelRow[];
  errors: SAPExcelRowError[];
}
