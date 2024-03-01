import { KeyGrouper } from '../../../entities/grouper/key-grouper.entity';
import { SAPExcelRowError } from './sap-error-row.interface';
import { SAPExcelRow } from './sap-row.entity';

export interface SAPExcelFile {
  fileName: string;
  fileKeys: KeyGrouper;
  rows: SAPExcelRow[];
  errors: SAPExcelRowError[];
}
