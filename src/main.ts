import { GroupedJournals } from './entities/grouper/grouped-journals';
import { groupJournalsByFileToExport } from './grouper/journal-grouper';
import { transformXmlToReport } from './transformers/xml.transformer';
import { readXmlFromAssets } from './xml-parser/xml-reader';

const fileName = `${__dirname}/assets/gl.20240105015614.xml`;

async function executeSkyLedgerIntegration(): Promise<Map<string, GroupedJournals>> {
  const xmlParsed = await readXmlFromAssets(fileName);
  const skyledgerReport = await transformXmlToReport(
    xmlParsed,
    `${__dirname}/transformers/assets/company-code.config.json`,
  );
  const groupedJournals = groupJournalsByFileToExport(skyledgerReport);
  return groupedJournals;
}

executeSkyLedgerIntegration();
