import csvParser from 'csv-parser';
import { handleStepError } from '../../exceptions/step-error.handler';
import { PROCESS_STEPS } from '../../exceptions/steps.constants';
import * as fs from 'fs';
import { SAPAccountMapper } from 'entities/sap-transformer/sap-account-mapper';
import { SAPCompanyMapper } from 'entities/sap-transformer/sap-company-mapper';
import { SAPMapper } from 'entities/sap-transformer/sap-mapper';
import { SAPMovementMapper } from 'entities/sap-transformer/sap-movement.mapper';
import { CSVEmptyException } from './exceptions/csv-empty.exception';
import { CSVFileNotFoundException } from './exceptions/csv-file-not-found.exception';
import { CSVFileNotReadableException } from './exceptions/csv-file-not-readable.exception';
import { CSVValidationException } from './exceptions/csv-validation.exception';
import { accountsSchema, companySchema, movementsSchema } from './validations.schemas';
import { CSVPaths } from 'entities/skyledger-transformed-report/csv.paths';

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

    await validateArraysSchemas(accountsMappings, movementsMappings, companyMappings);

    return {
      accountsMappings,
      movementsMappings,
      companyMappings,
    };
  } catch (error) {
    throw handleStepError(error, PROCESS_STEPS.CSV_INITIAL_LOAD);
  }
}

async function readCSV<T>(filePath: string): Promise<T[]> {
  if (!fs.existsSync(filePath)) {
    throw new CSVFileNotFoundException(filePath);
  }
  const results: T[] = [];
  try {
    const stream = fs.createReadStream(filePath).pipe(csvParser());
    for await (const data of stream) {
      results.push(data as T);
    }
  } catch (error) {
    throw new CSVFileNotReadableException(filePath);
  }

  return results;
}

function validateArrayLenghts(
  accountsMappings: SAPAccountMapper[],
  movementsMappings: SAPMovementMapper[],
  companyMappings: SAPCompanyMapper[],
): void {
  if (!accountsMappings.length || !movementsMappings.length || !companyMappings.length) {
    throw new CSVEmptyException();
  }
}
async function validateArraysSchemas(
  accountsMappings: SAPAccountMapper[],
  movementsMappings: SAPMovementMapper[],
  companyMappings: SAPCompanyMapper[],
): Promise<void> {
  await validateSchema(accountsMappings, accountsSchema);
  await validateSchema(movementsMappings, movementsSchema);
  await validateSchema(companyMappings, companySchema);
}

//desactivo por dificiltad de mapear en yup el tipo correcto
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function validateSchema<T>(items: T[], schema: any): Promise<void> {
  try {
    for (const item of items) {
      await schema.validate(item);
    }
  } catch (error) {
    const castedError = error as Error;
    throw new CSVValidationException(castedError.message);
  }
}
