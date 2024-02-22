export const TRANSFORMERS_ERROR_MESSAGES = {
  XML_VALIDATION_ERROR: 'XML validation error',
  INVALID_AMOUNT: (row: string): string => `invalid amount at register at register :${row}`,
  CONFIG_COMPANY_CODE_NOT_FOUND: (filePath: string): string =>
    `the company code filter config does not exist: ${filePath}`,
};
