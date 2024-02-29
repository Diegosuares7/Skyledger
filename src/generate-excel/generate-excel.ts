import { SAPExcelRow } from '../entities/sap-transformer/excel/sap-row.entity';
import { Workbook } from 'exceljs';
import * as ExcelJS from 'exceljs';
import { handleStepError } from '../exceptions/step-error.handler';
import { PROCESS_STEPS } from '../exceptions/steps.constants';

function capitalizeAndSpaceWords(str: string): string {
  const words = str.split(/(?=[A-Z])/);
  const capitalizedWords = words.map((word) => capitalizeFirstLetter(word));
  return capitalizedWords.join(' ');
}

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function applyCommonCellStyle(cell: ExcelJS.Cell): void {
  cell.font = { bold: true };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FAEBD7' } };
  cell.alignment = { vertical: 'middle', horizontal: 'center' };
  cell.border = {
    top: { style: 'thin', color: { argb: '000000' } },
    left: { style: 'thin', color: { argb: '000000' } },
    bottom: { style: 'thin', color: { argb: '000000' } },
    right: { style: 'thin', color: { argb: '000000' } },
  };
}

function addHeaderRow(worksheet: ExcelJS.Worksheet, headers: string[]): void {
  const headerRow = worksheet.addRow(headers.map((header) => capitalizeAndSpaceWords(header)));
  headerRow.eachCell((cell) => {
    applyCommonCellStyle(cell);
  });
}

function addAdditionalRow(worksheet: ExcelJS.Worksheet, data: string[]): void {
  const additionalRow = worksheet.addRow(data);
  additionalRow.eachCell((cell) => {
    applyCommonCellStyle(cell);
  });
}

export function createExcelFile(rows: SAPExcelRow[]): Workbook {
  try {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Agregar encabezados
    const headers = Object.keys(rows[0]);
    addHeaderRow(worksheet, headers);

    // Agregar filas adicionales
    const additionalRowsObligatory = [
      'Obligatorio',
      'Obligatorio',
      'Obligatorio',
      'Obligatorio',
      'Obligatorio',
      'Obligatorio',
      'Obligatorio',
      'Obligatorio',
      'Obligatorio',
      'Obligatorio',
      'Obligatorio',
      'Opcional',
      'Opcional',
      'Opcional',
      'Obligatorio',
      'Obligatorio',
      'Opcional',
      'Opcional',
      'Obligatorio',
      'Opcional',
      'Opcional',
      'Opcional',
      'Opcional',
      'Opcional',
      'Opcional',
      'Opcional',
      'Opcional',
      'Opcional',
      'Opcional',
      'Opcional',
      'Opcional',
      'Opcional',
      'Opcional',
      'Opcional',
      'Opcional',
      'Opcional',
      'Opcional',
      'Opcional',
      'Opcional',
      'Obligatorio',
      'Opcional',
      'Opcional',
      'Opcional',
      'Obligatorio',
      'Opcional',
    ];

    const additionalRowsNumbers = [
      '3',
      '2',
      '8',
      '4',
      '3',
      '4',
      '2',
      '3',
      '8',
      '8',
      '2',
      '16',
      '25',
      ' ',
      '2',
      '10',
      ' ',
      ' ',
      '15',
      '15',
      '2',
      '4',
      '10',
      '19',
      '4',
      '18',
      '50',
      '4',
      '12',
      '12',
      '20',
      '8',
      '1',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      '9.5',
      '10',
      ' ',
      ' ',
      '10',
      '2',
    ];

    const additionalRowsLetters = [
      'C',
      'CI',
      'C',
      'C',
      'C',
      'C',
      'C',
      'C',
      'C',
      'C',
      'C',
      'C',
      'C',
      'C',
      'C',
      'C',
      'C',
      'C',
      'N',
      'N',
      'C',
      'C',
      'C',
      'C',
      'C',
      'C',
      'C',
      'C',
      'C',
      'C',
      'C',
      'C',
      'C',
      'C',
      'C',
      'C',
      'C',
      'C',
      'C',
      'C',
      'C',
      'C',
      'C',
      'C',
      'C',
    ];

    addAdditionalRow(worksheet, additionalRowsObligatory);
    addAdditionalRow(worksheet, additionalRowsNumbers);
    addAdditionalRow(worksheet, additionalRowsLetters);

    // Agregar filas de datos
    rows.forEach((row) => {
      const dataRow = worksheet.addRow(Object.values(row));
      dataRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } },
        };
      });
    });

    // Retornar el archivo Excel
    return workbook;
  } catch (error) {
    throw handleStepError(error, PROCESS_STEPS.GENERATE_EXCEL_REGISTERS);
  }
}
