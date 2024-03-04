import { ProcessResponseEnum } from '../entities/process-response/process-response.entity';
import { SAPExcelFileResult } from '../entities/sap-transformer/excel/sap-excel-file-result.interface';
import { validateExcelRounding } from './round-excel-validator';
import { StepProcessHandledException } from '../exceptions/step-process-handled.exception';
import { SAPRoundMapper } from '../entities/sap-transformer/mappings/sap-round-mapper';
import Logger from '../configurations/config-logs/winston.logs';

/**
 * Validates the rounding of Excel files based on the provided rounding limit mapper.
 * @param excelResults - An array of SAPExcelFileResult objects representing the results of processing Excel files.
 * @param roundingLimitMapper - A mapping object where the keys are currency codes and the values are SAPRoundMapper objects.
 * @returns An array of SAPExcelFileResult objects representing the updated results of processing Excel files.
 */
export function checkExcelRoundings(
  excelResults: SAPExcelFileResult[],
  roundingLimitMapper: Record<string, SAPRoundMapper>,
): SAPExcelFileResult[] {
  return excelResults.map((excelResult: SAPExcelFileResult) => {
    if (excelResult.status === ProcessResponseEnum.SUCCESS) {
      try {
        Logger.info(`Successfully check excel rounding for file ${excelResult.file?.fileName}`);
        return validateExcelRounding(excelResult, roundingLimitMapper);
      } catch (e) {
        Logger.error(`Error in check excel rounding for file ${excelResult.file?.fileName}:`, e);
        const message = e instanceof StepProcessHandledException ? e.getErrorMessage() : e.message;
        return {
          ...excelResult,
          status: ProcessResponseEnum.ERROR,
          errorMessage: message,
        };
      }
    }
    return excelResult;
  });
}
