export const EXCEL_TRANSFORMER_ERROR_MESSAGES = {
  ENV_VARIABLES_MISSING: (variables: string): string => `env variables missing : ${variables}`,
  INVALID_FORMAT_DATE: 'Invalid format date : should be YYYYMMDD',
  INVALID_SKL_COMPANY_CODE: (code: string): string =>
    `the xml company code : ${code} is not founded in SAP company codes`,
  INVALID_SKL_ACCOUNT_CODE: (code: string): string =>
    `the xml account code : ${code} is not founded in SAP account codes`,

  INVALID_SKL_MOVEMENTS_CODE: (code: string): string =>
    `the xml movements type account : ${code} is not in the sap type accounts file`,

  INVALID_CME_CODE: (typeAccount: string): string =>
    `the type account : ${typeAccount} has not CME values in the csv file`,
};
