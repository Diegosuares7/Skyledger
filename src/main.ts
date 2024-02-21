import { loadCSVSAPInformation } from './sap-transformer/csv-loader/load-sap-mappings';
import { GroupedJournals } from './entities/grouper/grouped-journals';
import { groupJournalsByFileToExport } from './grouper/journal-grouper';
import { transformXmlToReport } from './transformers/xml.transformer';
import { readXmlFromAssets } from './xml-parser/xml-reader';
import { SAPMapper } from 'entities/sap-transformer/sap-mapper';

const fileName = `${__dirname}/assets/gl.20240105015614.xml`;

async function executeSkyLedgerIntegration(): Promise<Map<string, GroupedJournals>> {
  const sapInfo = await getPathsAndLoadSapInformation();
  const xmlParsed = await readXmlFromAssets(fileName);
  const skyledgerReport = await transformXmlToReport(
    xmlParsed,
    `${__dirname}/transformers/assets/company-code.config.json`,
  );
  const groupedJournals = groupJournalsByFileToExport(skyledgerReport);
  //TODO: Mapear cuentas con la info de SAP
  console.log(sapInfo);
  return groupedJournals;
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
