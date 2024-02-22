export const CSV_LOADER_ERROR_MESSAGES = {
  CSV_EMPTY_FILES: 'CSV files are empty',
  FILE_NOT_FOUND: (filePath: string): string => `File does not exist: ${filePath}`,
  FILE_NOT_READABLE: (filePath: string): string => `Fail in parse this csv : ${filePath}`,
  CSV_VALIDATION: (error: string): string => `CSV validation error: ${error}`,
  CSV_LOAD_UNHANDLED: `Csv load failed`,
};
