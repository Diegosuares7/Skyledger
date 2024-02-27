import { CSVEmptyException } from '../exceptions/csv-empty.exception';
import { CSVFileNotFoundException } from '../exceptions/csv-file-not-found.exception';
import { CSVValidationException } from '../exceptions/csv-validation.exception';
import { loadCSVSAPInformation } from '../load-sap-mappings';

describe('loadCSVSAPInformation', () => {
  it('should load SAP information from CSV files successfully', async () => {
    const paths = {
      accountsFilePath: __dirname + '/../tests/assets/sap-accounts-table.csv',
      movementsFilePath: __dirname + '/../tests/assets/sap-movements-table.csv',
      companyFilePath: __dirname + '/../tests/assets/sap-company-code-table.csv',
    };

    const sapMapper = await loadCSVSAPInformation(paths);

    expect(Object.keys(sapMapper.accountsMappings)).toHaveLength(3);
    expect(Object.keys(sapMapper.movementsMappings)).toHaveLength(3);
    expect(Object.keys(sapMapper.companyMappings)).toHaveLength(2);
  });

  it('should throw an error if CSV files are not found', async () => {
    const paths = {
      accountsFilePath: __dirname + '/../tests/assets/non-existent-file.csv',
      movementsFilePath: __dirname + '/../tests/assets/non-existent-file.csv',
      companyFilePath: __dirname + '/../tests/assets/non-existent-file.csv',
    };
    await expect(loadCSVSAPInformation(paths)).rejects.toThrow(CSVFileNotFoundException);
  });

  it('should throw an error if CSV files are empty', async () => {
    const paths = {
      accountsFilePath: __dirname + '/../tests/assets/empty.csv',
      movementsFilePath: __dirname + '/../tests/assets/empty.csv',
      companyFilePath: __dirname + '/../tests/assets/empty.csv',
    };
    await expect(loadCSVSAPInformation(paths)).rejects.toThrow(CSVEmptyException);
  });

  it('should throw an error if CSV files contain invalid data', async () => {
    const paths = {
      accountsFilePath: __dirname + '/../tests/assets/sap-accounts-invalid-data.csv',
      movementsFilePath: __dirname + '/../tests/assets/sap-movements-table.csv',
      companyFilePath: __dirname + '/../tests/assets/sap-company-code-table.csv',
    };
    await expect(loadCSVSAPInformation(paths)).rejects.toThrow(CSVValidationException);
  });
});
