export const XML_PARSER_ERROR_MESSAGES = {
  XML_EMPTY_FILES: 'XML files are empty',
  XML_VALIDATION_ERROR: 'XML validation error',
  INVALID_XML: (message: string): string => `XML validation error: ${message}`,
  XML_FILE_NOT_FOUND: (filePath: string): string => `File does not exist: ${filePath}`,
};
