import { ProcessResponse } from './entities/process-response/process-response.entity';
import { SAPMapper } from './entities/sap-transformer/mappings/sap-mapper';
import { createErrorResponse, createSuccesResponse } from './response-handler/create-process-response';
import { groupJournalsByFileToExport } from './grouper/journal-grouper';
import { loadCSVSAPInformation } from './sap-transformer/csv-loader/load-sap-mappings';
import { transformXmlToReport } from './transformers/xml.transformer';
import { readXmlFromAssets } from './xml-parser/xml-reader';
import { StepProcessHandledException } from './exceptions/step-process-handled.exception';
import { createExcelsFiles } from './sap-transformer/excel-transformer/excel-file-factory';
import dotenv from 'dotenv';
dotenv.config();

const fileName = `${__dirname}/assets/gl.20240105015614.xml`;

async function executeSkyLedgerIntegration(): Promise<ProcessResponse> {
  try {
    const sapInfo = await getPathsAndLoadSapInformation();
    const xmlParsed = await readXmlFromAssets(fileName);
    const skyledgerReport = await transformXmlToReport(
      xmlParsed,
      `${__dirname}/transformers/assets/company-code.config.json`,
    );
    const groupedJournals = groupJournalsByFileToExport(skyledgerReport);
    const excelsResults = createExcelsFiles(groupedJournals, sapInfo);
    console.log(excelsResults);
    //TODO: Mapear cuentas con la info de SAP
    return createSuccesResponse();
  } catch (error) {
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
  };
  return loadCSVSAPInformation(paths);
}

executeSkyLedgerIntegration();
