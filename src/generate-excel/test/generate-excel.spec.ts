import { createExcelFile } from '../../generate-excel/generate-excel';
import { SAPExcelRow } from '../../entities/sap-transformer/excel/sap-row.entity';
import { Workbook } from 'exceljs';
import dotenv from 'dotenv';
import { RowType } from '../../sap-transformer/excel-transformer/enums/row-type.enum';
dotenv.config();

describe('generateExcel', () => {
  it('should throw an error when given an empty array of SAPExcelRow objects', () => {
    // Arrange
    const rows: SAPExcelRow[] = [];

    // Act & Assert
    expect(() => createExcelFile(rows)).toThrowError();
  });

  it('should generate an Excel file with headers and data rows', () => {
    // Arrange
    const rows = [
      new SAPExcelRow('20220101', 'USD', '202201', 100, 'Descripción Cuenta 1', 'Nombre Cuenta 1', RowType.DEBIT),
      new SAPExcelRow('20220102', 'EUR', '202201', 200, 'Descripción Cuenta 2', 'Nombre Cuenta 2', RowType.CREDIT),
      new SAPExcelRow('20220103', 'GBP', '202201', 300, 'Descripción Cuenta 3', 'Nombre Cuenta 3', RowType.DEBIT),
    ];

    // Act
    const result = createExcelFile(rows);

    // Assert
    expect(result).toBeInstanceOf(Workbook);
    expect(result.worksheets.length).toBe(1);
    const worksheet = result.worksheets[0];
    expect(worksheet.name).toBe('Sheet 1');

    // Verificar encabezados
    const headerRow = worksheet.getRow(1);
    const expectedHeaders = [
      'Mandante',
      'Interfaz',
      'Fecha Entrada',
      'Numero',
      'Correlativo',
      'Sociedad',
      'Clase De Docto',
      'Moneda',
      'Fecha Contabilizacion',
      'Fecha Docto',
      'Mes Contabilizacion',
      'Referencia',
      'Texto Cabecera',
      'Lugar Comercial',
      'Clave Contabilizacion',
      'Cuenta Contable',
      'Cme',
      'Sociedad Para Siguiente Posicion',
      'Monto En Moneda Del Docto',
      'Monto En Moneda Local',
      'Indicador De Impto',
      'Division',
      'Centro De Costo',
      'Orden C O',
      'Condicion De Pago',
      'Asignacion',
      'Texto Posicion',
      'Sociedad G L',
      'Referencia1',
      'Referencia2',
      'Referencia3',
      'Fecha Valor',
      'Checkbox Calcular Impto Automaticamente',
      'Bloqueo De Pago',
      'Fecha Base De Vcto',
      'Bloqueo De Reclamacion',
      'Numero De Contrato',
      'Clase De Contrato',
      'Fecha De Conversion',
      'Tipo De Cambio',
      'Centro De Beneficio',
      'Elemento P E P',
      'Clase De Movto',
      'Segmento',
      'Gr Ledgers',
    ];
    expect(headerRow.values).toEqual(expect.arrayContaining(expectedHeaders));
  });
});
