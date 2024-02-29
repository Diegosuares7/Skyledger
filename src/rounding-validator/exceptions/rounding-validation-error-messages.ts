export const ROUNDING_VALIDATION_ERROR_MESSAGES = {
  INVALID_ROUNDING: (currencyCode: string, limit: number): string =>
    `For the currency ${currencyCode},The sum between amounts exceeds the rounding limit of ${limit}.`,
  INVALID_CURRENCY_MAP: (currencyCode: string): string =>
    `The currency code ${currencyCode} has not a limit value to validate.`,
};
