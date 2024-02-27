import { StepProcessHandledException } from '../../../exceptions/step-process-handled.exception';
import { PROCESS_STEPS } from '../../../exceptions/steps.constants';
import { CSV_LOADER_ERROR_MESSAGES } from './csv-loader-exceptions.constants';

export class CSVFileNotReadableException extends StepProcessHandledException {
  constructor(filePath: string, message: string) {
    super(PROCESS_STEPS.CSV_INITIAL_LOAD, CSV_LOADER_ERROR_MESSAGES.FILE_NOT_READABLE(filePath, message));
    this.name = 'CSVFileNotReadableException';
  }
}
