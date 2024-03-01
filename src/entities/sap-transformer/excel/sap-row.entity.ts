import { ExcelEnvVariablesMissingException } from '../../../sap-transformer/excel-transformer/exceptions/excel-env-variables-missing.exception';
import { SAP_ROW_CONSTANTS } from './sap-row.constants';
import { ExcelDateInvalidFormatException } from '../../../sap-transformer/excel-transformer/exceptions/excel-date-invalid-format.exception';
import { RowType } from '../../../sap-transformer/excel-transformer/enums/row-type.enum';
import { round } from '../../../utils/round';

const DATE_FORMAT_REGEX = /^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/;

//puse los nombres en epsañol porque iba a ser mas facil para el mapeo de columnas (aunque no este muy bien mezclar idiomas de interfaces)
export class SAPExcelRow {
  mandante = '';
  interfaz = '';
  fechaEntrada = '';
  numero: number;
  correlativo: number;
  sociedad = '';
  claseDeDocto = '';
  moneda = '';
  fechaContabilizacion = '';
  fechaDocto = '';
  mesContabilizacion = '';
  referencia = '';
  textoCabecera = '';
  lugarComercial = '';
  claveContabilizacion = '';
  cuentaContable = '';
  cme = '';
  sociedadParaSiguientePosicion = '';
  montoEnMonedaDelDocto: number;
  montoEnMonedaLocal = '';
  indicadorDeImpto = '';
  division = '';
  centroDeCosto = '';
  ordenCO = '';
  condicionDePago = '';
  asignacion = '';
  textoPosicion = '';
  sociedadGL = '';
  referencia1 = '';
  referencia2 = '';
  referencia3 = '';
  fechaValor = '';
  checkboxCalcularImptoAutomaticamente = '';
  bloqueoDePago = '';
  fechaBaseDeVcto = '';
  bloqueoDeReclamacion = '';
  numeroDeContrato = '';
  claseDeContrato = '';
  fechaDeConversion = '';
  tipoDeCambio = '';
  centroDeBeneficio = '';
  elementoPEP = '';
  claseDeMovto = '';
  segmento = '';
  grLedgers = '';
  //esta propieda la agrego para que no sea tan complicado el calculo del redondeo
  type: RowType;

  constructor(
    date: string,
    currencyCode: string,
    monthPeriodAccount: string,
    amount: number,
    accountDescription: string,
    accountName: string,
    type: RowType,
  ) {
    this.validateDateFormat(date);
    this.validateEnv();

    this.mandante = process.env.MANDANTE_VALUE!.toString();
    this.interfaz = SAP_ROW_CONSTANTS.INTERFAZ_DEFAULT_VALUE;
    this.fechaEntrada = date;
    this.numero = SAP_ROW_CONSTANTS.NUMERO_DEFAULT_VALUE;
    this.claseDeDocto = SAP_ROW_CONSTANTS.CLASE_DOCTO_DEFAULT_VALUE;
    this.moneda = currencyCode;
    //TODO REVISAR ESTO PORQUE ENTIENDO QUE DEBERIA IR EL PERIODO CONTABLE
    this.fechaContabilizacion = date;
    this.fechaDocto = date;
    this.mesContabilizacion = monthPeriodAccount;
    //revisar: APLICO ABS Y REDONDEO A DOS DECIMALES
    this.montoEnMonedaDelDocto = round(Math.abs(amount));
    this.textoPosicion = accountDescription;
    this.referencia1 = accountName;
    this.type = type;
  }

  setCorrelativo(correlativo: number): void {
    this.correlativo = correlativo;
  }

  validateEnv(): void {
    if (!process.env.MANDANTE_VALUE) {
      throw new ExcelEnvVariablesMissingException('MANDANTE_VALUE');
    }
  }

  //validate if string is YYYYMMDD FORMAT
  validateDateFormat(date: string): void {
    if (!DATE_FORMAT_REGEX.test(date)) {
      throw new ExcelDateInvalidFormatException();
    }
  }
}
