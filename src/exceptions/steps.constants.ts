export enum PROCESS_STEPS {
  READ_FILE_FROM_S3 = 'Read file from S3',
  CSV_INITIAL_LOAD = 'CSV initial load',
  XML_PARSE = 'XML parse',
  XML_TRANSFORM_TO_REPORT = 'transform XML to report',
  GROUP_REPORT_TO_FILES = 'Grouping reports to get files registrys',
  GENERATE_EXCEL_REGISTERS = 'Generate excel registers',
  UPLOAD_EXCEL_FILES = 'Upload excel files to S3',
  ROUNDING_VALIDATION = 'Validate rounding',
}
