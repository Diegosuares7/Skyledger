import { StepProcessHandledException } from '../../../exceptions/step-process-handled.exception';
import { PROCESS_STEPS } from '../../../exceptions/steps.constants';
import { CSV_LOADER_ERROR_MESSAGES } from './csv-loader-exceptions.constants';

export class CSVValidationException extends StepProcessHandledException {
  constructor(message: string) {
    super(PROCESS_STEPS.CSV_INITIAL_LOAD, CSV_LOADER_ERROR_MESSAGES.CSV_VALIDATION(message));
  }
}
