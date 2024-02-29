import * as fastcsv from 'fast-csv';
import { handleStepError } from '../../exceptions/step-error.handler';
import { PROCESS_STEPS } from '../../exceptions/steps.constants';
import * as fs from 'fs';
import { SAPAccountMapper } from '../../entities/sap-transformer/mappings/sap-account-mapper';
import { SAPCompanyMapper } from '../../entities/sap-transformer/mappings/sap-company-mapper';
import { SAPMapper } from '../../entities/sap-transformer/mappings/sap-mapper';
import { SAPMovementMapper } from '../../entities/sap-transformer/mappings/sap-movement.mapper';
import { CSVEmptyException } from './exceptions/csv-empty.exception';
import { CSVFileNotFoundException } from './exceptions/csv-file-not-found.exception';
import { CSVFileNotReadableException } from './exceptions/csv-file-not-readable.exception';
import { CSVValidationException } from './exceptions/csv-validation.exception';
import { accountsSchema, companySchema, movementsSchema, roundLimitSchema } from './validations.schemas';
import { CSVPaths } from 'entities/skyledger-transformed-report/csv.paths';
import { SAPRoundMapper } from 'entities/sap-transformer/mappings/sap-round-mapper';

export async function loadCSVSAPInformation(paths: CSVPaths): Promise<SAPMapper> {
  try {
    const accountsPromise = readCSV<SAPAccountMapper>(paths.accountsFilePath);
    const movementsPromise = readCSV<SAPMovementMapper>(paths.movementsFilePath);
    const companyPromise = readCSV<SAPCompanyMapper>(paths.companyFilePath);
    const roundLimitPromise = readCSV<SAPRoundMapper>(paths.roundLimitFilePath);

    const [accountsMappings, movementsMappings, companyMappings, roundLimitMappings] = await Promise.all([
      accountsPromise,
      movementsPromise,
      companyPromise,
      roundLimitPromise,
    ]);
    validateArrayLenghts(accountsMappings, movementsMappings, companyMappings, roundLimitMappings);

    await validateArraysSchemas(accountsMappings, movementsMappings, companyMappings, roundLimitMappings);
    return generateDictionaries(accountsMappings, movementsMappings, companyMappings, roundLimitMappings);
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
    const stream = fs.createReadStream(filePath).pipe(fastcsv.parse({ headers: true }));
    for await (const data of stream) {
      results.push(data as T);
    }
  } catch (error) {
    throw new CSVFileNotReadableException(filePath, error.message);
  }

  return results;
}

function validateArrayLenghts(
  accountsMappings: SAPAccountMapper[],
  movementsMappings: SAPMovementMapper[],
  companyMappings: SAPCompanyMapper[],
  roundLimitMappings: SAPRoundMapper[],
): void {
  if (!accountsMappings.length || !movementsMappings.length || !companyMappings.length || !roundLimitMappings.length) {
    throw new CSVEmptyException();
  }
}
async function validateArraysSchemas(
  accountsMappings: SAPAccountMapper[],
  movementsMappings: SAPMovementMapper[],
  companyMappings: SAPCompanyMapper[],
  roundLimitMappings: SAPRoundMapper[],
): Promise<void> {
  await validateSchema(accountsMappings, accountsSchema);
  await validateSchema(movementsMappings, movementsSchema);
  await validateSchema(companyMappings, companySchema);
  await validateSchema(roundLimitMappings, roundLimitSchema);
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
function generateDictionaries(
  accountsMappings: SAPAccountMapper[],
  movementsMappings: SAPMovementMapper[],
  companyMappings: SAPCompanyMapper[],
  roundLimitMappings: SAPRoundMapper[],
): SAPMapper {
  const accountsDict = Object.fromEntries(accountsMappings.map((x) => [x.SLAccount, x]));
  const movementsDict = Object.fromEntries(movementsMappings.map((x) => [x.accountType, x]));
  const companiesDict = Object.fromEntries(companyMappings.map((x) => [x.SLCompanyCode, x]));
  const roundLimitDict = Object.fromEntries(roundLimitMappings.map((x) => [x.currencyCode, x]));
  return {
    accountsMappings: accountsDict,
    movementsMappings: movementsDict,
    companyMappings: companiesDict,
    roundLimitMappings: roundLimitDict,
  };
}
