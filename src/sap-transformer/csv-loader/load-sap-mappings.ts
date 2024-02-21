import * as yup from 'yup';
import csvParser from 'csv-parser';
import * as fs from 'fs';
import { SAPMapper } from '../../entities/sap-transformer/sap-mapper';
import { SAPAccountMapper } from '../../entities/sap-transformer/sap-account-mapper';
import { SAPMovementMapper } from '../../entities/sap-transformer/sap-movement.mapper';
import { SAPCompanyMapper } from '../../entities/sap-transformer/sap-company-mapper';
import { CSVPaths } from 'entities/skyledger-transformed-report/csv.paths';

const accountsSchema = yup.object().shape({
  SLAccount: yup.string().required(),
  SAPAccount: yup.string().required(),
  AccountType: yup.string().required(),
  CME: yup.string().notRequired(),
  CostCenter: yup.string().notRequired(),
});

const movementsSchema = yup.object().shape({
  accountType: yup.string().required(),
  debit: yup.number().required(),
  credit: yup.number().required(),
  debitCME: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .nullable(),
  creditCME: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .nullable(),
});

const companySchema = yup.object().shape({
  SLCompanyCode: yup.string().required(),
  SAPCompanyCode: yup.string().required(),
});

export async function loadCSVSAPInformation(paths: CSVPaths): Promise<SAPMapper> {
  try {
    const accountsPromise = readCSV<SAPAccountMapper>(paths.accountsFilePath);
    const movementsPromise = readCSV<SAPMovementMapper>(paths.movementsFilePath);
    const companyPromise = readCSV<SAPCompanyMapper>(paths.companyFilePath);

    const [accountsMappings, movementsMappings, companyMappings] = await Promise.all([
      accountsPromise,
      movementsPromise,
      companyPromise,
    ]);
    validateArrayLenghts(accountsMappings, movementsMappings, companyMappings);
    await Promise.all(accountsMappings.map((mapping) => accountsSchema.validate(mapping)));
    await Promise.all(movementsMappings.map((mapping) => movementsSchema.validate(mapping)));
    await Promise.all(companyMappings.map((mapping) => companySchema.validate(mapping)));

    return {
      accountsMappings,
      movementsMappings,
      companyMappings,
    };
  } catch (error) {
    console.error('Error al leer los archivos CSV:', error);
    throw new Error('Failed to load SAP information from CSV files.'); // Wrap error in custom Error object
  }
}

async function readCSV<T>(filePath: string): Promise<T[]> {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File does not exist: ${filePath}`);
  }

  const results: T[] = [];
  const stream = fs.createReadStream(filePath).pipe(csvParser());

  for await (const data of stream) {
    results.push(data as T);
  }

  return results;
}

function validateArrayLenghts(
  accountsMappings: SAPAccountMapper[],
  movementsMappings: SAPMovementMapper[],
  companyMappings: SAPCompanyMapper[],
): void {
  if (!accountsMappings.length || !movementsMappings.length || !companyMappings.length) {
    throw new Error('CSV files are empty');
  }
}
