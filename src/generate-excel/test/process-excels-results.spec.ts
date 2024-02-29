import { ProcessResponseEnum } from '../../entities/process-response/process-response.entity';
import { processExcelsResults } from '../../generate-excel/process-excels-results';
import { SAPExcelRow } from '../../entities/sap-transformer/excel/sap-row.entity';
import { SAPExcelFileResult } from '../../entities/sap-transformer/excel/sap-excel-file-result.interface';
import dotenv from 'dotenv';
import { Workbook } from 'exceljs';
import { RowType } from '../../sap-transformer/excel-transformer/enums/row-type.enum';
dotenv.config();

describe('processExcelsResults', () => {
  it('should return a list of Workbooks when given a list of SAPExcelFileResult objects with status SUCCESS and a non-null file attribute', async () => {
    const excelsResults: SAPExcelFileResult[] = [
      {
        file: {
          fileName: 'file1.xlsx',
          fileKeys: {
            currency: 'USD',
            companyCode: 'JA',
            accountPeriod: '20220101',
          },
          rows: [
            new SAPExcelRow('20220101', 'USD', '202201', 100, 'Descripción Cuenta 1', 'Nombre Cuenta 1', RowType.DEBIT),
            new SAPExcelRow(
              '20220102',
              'EUR',
              '202201',
              200,
              'Descripción Cuenta 2',
              'Nombre Cuenta 2',
              RowType.CREDIT,
            ),
          ],
          errors: [],
        },
        status: ProcessResponseEnum.SUCCESS,
      },
      {
        file: {
          fileName: 'file2.xlsx',
          fileKeys: {
            currency: 'GBP',
            companyCode: 'JA',
            accountPeriod: '20220101',
          },
          rows: [
            new SAPExcelRow('20220103', 'GBP', '202201', 300, 'Descripción Cuenta 3', 'Nombre Cuenta 3', RowType.DEBIT),
          ],
          errors: [],
        },
        status: ProcessResponseEnum.SUCCESS,
      },
    ];

    const excelFiles = await processExcelsResults(excelsResults);
    expect(excelFiles[0]).toBeInstanceOf(Workbook);
    expect(excelFiles[1]).toBeInstanceOf(Workbook);
  });
});
