import Logger from '../../configurations/config-logs/winston.logs';
import { GroupedJournals } from '../../entities/grouper/grouped-journals';
import { ProcessResponseEnum } from '../../entities/process-response/process-response.entity';
import { SAPExcelFileResult } from '../../entities/sap-transformer/excel/sap-excel-file-result.interface';
import { SAPExcelFile } from '../../entities/sap-transformer/excel/sap-excel-file.interface';
import { SAPMapper } from '../../entities/sap-transformer/mappings/sap-mapper';
import { generateExcelFile } from './excel-mapper';

export function createExcelsFiles(
  groupedJournals: Map<string, GroupedJournals>,
  mapper: SAPMapper,
): SAPExcelFileResult[] {
  return Array.from(groupedJournals.values()).map((journalGroup: GroupedJournals, index) => {
    try {
      const file = generateExcelFile(journalGroup!, mapper, index);
      Logger.info(`Successfully create excels file ${file.fileName}`);
      return generateExcelFileResult(file);
    } catch (e) {
      Logger.error(`Error in create excels file:`, e);
      return { status: ProcessResponseEnum.ERROR, errorMessage: e.message };
    }
  });
}

function generateExcelFileResult(file: SAPExcelFile): SAPExcelFileResult {
  return {
    file,
    status: !file.errors.length ? ProcessResponseEnum.SUCCESS : ProcessResponseEnum.ERROR,
  };
}
