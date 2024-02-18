import { SkyLedgerReport } from './entities/skyledger-transformed-report/skyledger-report';
import { transformXmlToReport } from './transformers/xml.transformer';
import { readXmlFromAssets } from './xml-parser/xml-reader';

const fileName = `${__dirname}/assets/gl.20240105015614.xml`;

async function executeSkyLedgerIntegration(): Promise<SkyLedgerReport> {
  const xmlParsed = await readXmlFromAssets(fileName);
  const skyledgerReport = await transformXmlToReport(
    xmlParsed,
    `${__dirname}/transformers/assets/company-code.config.json`,
  );
  return skyledgerReport;
}

executeSkyLedgerIntegration();
