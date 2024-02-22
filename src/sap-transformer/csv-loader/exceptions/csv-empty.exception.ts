import { PROCESS_STEPS } from '../../../exceptions/steps.constants';
import { CSV_LOADER_ERROR_MESSAGES } from './csv-loader-exceptions.constants';
import { StepProcessHandledException } from '../../../exceptions//step-process-handled.exception';

export class CSVEmptyException extends StepProcessHandledException {
  constructor() {
    super(PROCESS_STEPS.CSV_INITIAL_LOAD, CSV_LOADER_ERROR_MESSAGES.CSV_EMPTY_FILES);
    this.name = 'CSVEmptyException';
  }
}
