import { transformXmlToReport } from './transformers/xml.transformer';
import { readXmlFromAssets } from './xml-parser/xml-reader';

const fileName = `${__dirname}/assets/gl.20240105015614.xml`;

const executeSkyLedgerIntegration = async () => {
  const xmlParsed = await readXmlFromAssets(fileName);
  const skyledgerReport = transformXmlToReport(xmlParsed);
  return skyledgerReport;
};

executeSkyLedgerIntegration();
