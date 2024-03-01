import { ProcessResponseEnum } from '../entities/process-response/process-response.entity';
import { SAPExcelFileResult } from '../entities/sap-transformer/excel/sap-excel-file-result.interface';
import { RowType } from '../sap-transformer/excel-transformer/enums/row-type.enum';
import { SAPRoundMapper } from '../entities/sap-transformer/mappings/sap-round-mapper';
import { InvalidCurrencyForRoundingException } from './exceptions/invalid-currency-for-rounding.exception';
import { ROUNDING_VALIDATION_ERROR_MESSAGES } from './exceptions/rounding-validation-error-messages';
import { SAPExcelFile } from '../entities/sap-transformer/excel/sap-excel-file.interface';

/**
 * Checks if the sum of the amounts in a SAP Excel file exceeds a specified rounding limit.
 * If the sum exceeds the limit, it updates the status of the file result to "error" and sets an error message.
 * @param excelResult - The SAP Excel file result object containing the file and its status.
 * @param roundingLimitMapper - The rounding limit mapper object containing the currency code and the rounding limit value.
 * @returns The updated excelResult object with the status and error message if the sum of amounts exceeds the rounding limit.
 */
export function validateExcelRounding(
  excelResult: SAPExcelFileResult,
  roundingLimitMapper: Record<string, SAPRoundMapper>,
): SAPExcelFileResult {
  const excel = excelResult.file!;
  const currencyLimit = getCurrencyLimit(excel, roundingLimitMapper);
  const sum = calculateSum(excel);
  checkAndUpdateResult(excelResult, currencyLimit, sum);
  return excelResult;
}

function getCurrencyLimit(excel: SAPExcelFile, roundingLimitMapper: Record<string, SAPRoundMapper>): SAPRoundMapper {
  const currencyLimit = roundingLimitMapper[excel.fileKeys.currency];
  if (!currencyLimit) {
    throw new InvalidCurrencyForRoundingException(excel.fileKeys.currency);
  }
  return currencyLimit;
}

function calculateSum(excel: SAPExcelFile): number {
  let sum = 0;
  //verificar el tema del abs
  for (const row of excel.rows) {
    if (row.type === RowType.CREDIT) {
      sum -= row.montoEnMonedaDelDocto;
    } else if (row.type === RowType.DEBIT) {
      sum += row.montoEnMonedaDelDocto;
    }
  }
  return sum;
}

function checkAndUpdateResult(
  excelResult: SAPExcelFileResult,
  currencyLimit: SAPRoundMapper,
  sum: number,
): SAPExcelFileResult {
  if (Math.abs(sum) >= currencyLimit.value) {
    excelResult.status = ProcessResponseEnum.ERROR;
    excelResult.errorMessage = ROUNDING_VALIDATION_ERROR_MESSAGES.INVALID_ROUNDING(
      currencyLimit.currencyCode,
      currencyLimit.value,
    );
  }
  return excelResult;
}
