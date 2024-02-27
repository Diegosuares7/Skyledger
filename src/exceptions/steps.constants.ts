export enum PROCESS_STEPS {
  CSV_INITIAL_LOAD = 'CSV initial load',
  XML_PARSE = 'XML parse',
  XML_TRANSFORM_TO_REPORT = 'transform XML to report',
  GROUP_REPORT_TO_FILES = 'Grouping reports to get files registrys',
  GENERATE_EXCEL_REGISTERS = 'Generate excel registers',
}
