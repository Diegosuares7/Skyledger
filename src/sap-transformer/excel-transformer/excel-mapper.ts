import { AccountInfo } from '../../entities/grouper/account-info.entity';
import { GroupedJournals } from '../../entities/grouper/grouped-journals';
import { KeyGrouper } from '../../entities/grouper/key-grouper.entity';
import { SAPExcelRow } from '../../entities/sap-transformer/excel/sap-row.entity';
import { SAPMapper } from '../../entities/sap-transformer/mappings/sap-mapper';
import { InvalidSKLCodeCompanyMappingException } from './exceptions/invalid-code-company-mapping.exception';
import { RowType } from './enums/row-type.enum';
import { SAPMovementMapper } from '../../entities/sap-transformer/mappings/sap-movement.mapper';
import { SAPAccountMapper } from '../../entities/sap-transformer/mappings/sap-account-mapper';
import { InvalidAccountMappingExceptions } from './exceptions/invalid-account-mapping.exception';
import { InvalidMovementMappingException } from './exceptions/invalid-movement.mapping.exception';
import { SAPExcelFile } from '../../entities/sap-transformer/excel/sap-excel-file.interface';
import { SAPExcelRowError } from '../../entities/sap-transformer/excel/sap-error-row.interface';
import { StepProcessHandledException } from '../../exceptions/step-process-handled.exception';
import { InvalidCMECodeException } from './exceptions/invalid-cme-code.exception';

export function generateExcelFile(
  grouperJournals: GroupedJournals,
  sapMappingTables: SAPMapper,
  correlativeFile: number,
): SAPExcelFile {
  const fileName = createFileName(grouperJournals, sapMappingTables, correlativeFile);
  const excelRows: SAPExcelRow[] = [];
  const excelErrorRows: SAPExcelRowError[] = [];
  //el codigo esta algo repetido pero creo que es mas claro que crear una funcion con tantos parametros
  grouperJournals.accountsInfo.forEach((accountInfo: AccountInfo) => {
    const creditRow = generateExcelRow(
      grouperJournals.keyGrouper,
      accountInfo,
      sapMappingTables,
      correlativeFile,
      grouperJournals.entryDate,
      RowType.CREDIT,
    );
    addRowToRowArray(creditRow, excelErrorRows, excelRows);

    const debitRow = generateExcelRow(
      grouperJournals.keyGrouper,
      accountInfo,
      sapMappingTables,
      correlativeFile,
      grouperJournals.entryDate,
      RowType.DEBIT,
    );
    addRowToRowArray(debitRow, excelErrorRows, excelRows);
  });
  //esta iteracion es al pedo tal vez pero creo que es mas claro que estar pasando el numero a la funcion de addRowToRowArray
  let correlative = 1;
  excelRows.forEach((x) => {
    x.setCorrelativo(correlative++);
  });
  return { fileName, rows: excelRows, errors: excelErrorRows };
}

function createFileName(journals: GroupedJournals, mapper: SAPMapper, index: number): string {
  const sapCompanyCode = getSAPCompanyCode(journals.keyGrouper, mapper).substring(0, 2);
  const accountPeriod = journals.keyGrouper.accountPeriod;
  const correlativeString = (index + 1).toString().padStart(2, '0');
  return `${sapCompanyCode}${accountPeriod}${correlativeString}.xlsx`;
}

function generateExcelRow(
  keyGrouper: KeyGrouper,
  accountInfo: AccountInfo,
  sapMappingTables: SAPMapper,
  correlativeFile: number,
  entryDate: string,
  rowType: RowType,
): SAPExcelRow | null | SAPExcelRowError {
  try {
    const movementAmount = rowType === RowType.CREDIT ? accountInfo.creditAmount : accountInfo.debitAmount;
    // si el movimiento esta en cero lo salteo
    if (!movementAmount) {
      return null;
    }
    const row = new SAPExcelRow(
      entryDate,
      keyGrouper.currency,
      extractMonth(keyGrouper.accountPeriod),
      movementAmount,
      accountInfo.accountName,
      accountInfo.accountDescription,
    );
    row.sociedad = getSAPCompanyCode(keyGrouper, sapMappingTables);
    row.referencia = generateReferenceValue(row.sociedad, entryDate, correlativeFile);
    row.claveContabilizacion = getContableKey(accountInfo, sapMappingTables, rowType).toString();
    row.cuentaContable = getContableAccount(accountInfo, sapMappingTables);
    return row;
  } catch (error) {
    const message = error instanceof StepProcessHandledException ? error.getErrorMessage() : (error as Error).message;
    return { message, accountName: accountInfo.accountName };
  }
}
//extract MM from YYYYMM format
function extractMonth(date: string): string {
  return date.substring(4, 6);
}

export function getSAPCompanyCode(keygrouper: KeyGrouper, sapMappingTables: SAPMapper): string {
  const companyCodeMapping = sapMappingTables.companyMappings[keygrouper.companyCode];
  if (!companyCodeMapping) {
    throw new InvalidSKLCodeCompanyMappingException(keygrouper.companyCode);
  }
  return companyCodeMapping.SAPCompanyCode;
}

function generateReferenceValue(sapCompanyCode: string, date: string, correlative: number): string {
  const SAPCompanyCodeKey = sapCompanyCode.substring(0, 2);
  const correlativeString = correlative.toString().padStart(2, '0');
  return `${SAPCompanyCodeKey}${date}${correlativeString}`;
}

function getContableKey(accountInfo: AccountInfo, sapMappingTables: SAPMapper, rowType: RowType): number {
  const { accountName } = accountInfo;
  const sapAccountMapper = sapMappingTables.accountsMappings[accountName];
  if (!sapAccountMapper) {
    throw new InvalidAccountMappingExceptions(accountName);
  }
  const movementMapper = sapMappingTables.movementsMappings[sapAccountMapper.AccountType];
  if (!movementMapper) {
    throw new InvalidMovementMappingException(sapAccountMapper.AccountType);
  }
  return getContableKeyByAccountType(sapAccountMapper, movementMapper, rowType);
}

function getContableKeyByAccountType(
  accountMapper: SAPAccountMapper,
  movementsMapping: SAPMovementMapper,
  rowType: RowType,
): number {
  switch (accountMapper.AccountType.toUpperCase()) {
    case 'CLIENTE':
      return getContableKeyForClient(rowType, movementsMapping, accountMapper.CME);
    default:
      return getContableKeyDefault(rowType, movementsMapping);
  }
}

function getContableKeyDefault(rowType: RowType, movementMapping: SAPMovementMapper): number {
  if (rowType === RowType.DEBIT) {
    return movementMapping.debit;
  }
  return movementMapping.credit;
}

function getContableKeyForClient(rowType: RowType, movementsMapping: SAPMovementMapper, cme?: string): number {
  if (!cme) {
    return getContableKeyDefault(rowType, movementsMapping);
  } else {
    if (!movementsMapping.debitCME || !movementsMapping.creditCME) {
      throw new InvalidCMECodeException(movementsMapping.accountType);
    }
    if (rowType === RowType.DEBIT) {
      return movementsMapping.debitCME;
    }
    return movementsMapping.creditCME;
  }
}

function getContableAccount(accountInfo: AccountInfo, sapMappingTables: SAPMapper): string {
  const { accountName } = accountInfo;
  const sapAccountMapper = sapMappingTables.accountsMappings[accountName];
  if (!sapAccountMapper) {
    throw new InvalidAccountMappingExceptions(accountName);
  }
  return sapAccountMapper.SAPAccount;
}
function addRowToRowArray(
  row: SAPExcelRow | SAPExcelRowError | null,
  excelErrorRows: SAPExcelRowError[],
  excelRows: SAPExcelRow[],
): void {
  if (row instanceof SAPExcelRow) {
    excelRows.push(row);
  } else if (row) {
    excelErrorRows.push(row);
  }
}
