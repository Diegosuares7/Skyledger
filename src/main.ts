import dotenv from 'dotenv';
import Logger from './configurations/config-logs/winston.logs';
import { ProcessResponse } from './entities/process-response/process-response.entity';
import { SAPMapper } from './entities/sap-transformer/mappings/sap-mapper';
import { StepProcessHandledException } from './exceptions/step-process-handled.exception';
import { processExcelsResults } from './generate-excel/process-excels-results';
import { groupJournalsByFileToExport } from './grouper/journal-grouper';
import { createErrorResponse, createSuccesResponse } from './response-handler/create-process-response';
import { checkExcelRoundings } from './rounding-validator/check-excel-roundings';
import { getLatestFile } from './s3-process/s3-latest-file';
import { uploadExcelsToS3 } from './s3-process/s3-upload-excels';
import { loadCSVSAPInformation } from './sap-transformer/csv-loader/load-sap-mappings';
import { createExcelsFiles } from './sap-transformer/excel-transformer/excel-file-factory';
import { transformXmlToReport } from './transformers/xml.transformer';
import { readXmlFromAssets } from './xml-parser/xml-reader';
dotenv.config();

async function executeSkyLedgerIntegration(): Promise<ProcessResponse> {
  try {
    const file = await getLatestFile('test-jest');
    const sapInfo = await getPathsAndLoadSapInformation();
    const xmlParsed = await readXmlFromAssets(file);
    const skyledgerReport = await transformXmlToReport(
      xmlParsed,
      `${__dirname}/transformers/assets/company-code.config.json`,
    );
    const groupedJournals = groupJournalsByFileToExport(skyledgerReport);
    const excelsToProcess = createExcelsFiles(groupedJournals, sapInfo);
    const excelsWithRoundingChecked = checkExcelRoundings(excelsToProcess, sapInfo.roundLimitMappings);
    const excelFiles = await processExcelsResults(excelsWithRoundingChecked);
    const excelFilesUploaded = await uploadExcelsToS3(excelFiles, 'upload-files-jetsmart');
    Logger.info('Successfully execute SkyLedger Integration');
    const response = createSuccesResponse(excelFilesUploaded);
    return response;
  } catch (error) {
    Logger.error('Error in SkyLedger', error);
    if (error instanceof StepProcessHandledException) {
      return createErrorResponse(error.getErrorMessage());
    }
    const errorMessage = (error as Error).message || 'Unknown error occurred';
    return createErrorResponse(errorMessage);
  }
}

async function getPathsAndLoadSapInformation(): Promise<SAPMapper> {
  const paths = {
    accountsFilePath: `${__dirname}/assets/sap-accounts-table.csv`,
    movementsFilePath: `${__dirname}/assets/sap-movements-table.csv`,
    companyFilePath: `${__dirname}/assets/sap-company-code-table.csv`,
    roundLimitFilePath: `${__dirname}/assets/sap-round-table.csv`,
  };
  Logger.info('Successfully get paths and load SAP information');
  return loadCSVSAPInformation(paths);
}

executeSkyLedgerIntegration();
