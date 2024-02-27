import { StepProcessHandledException } from '../../exceptions/step-process-handled.exception';
import { PROCESS_STEPS } from '../../exceptions/steps.constants';
import { LATEST_FILE_ERROR_MESSAGES } from './csv-loader-exceptions.constants';

export class FileNotFoundException extends StepProcessHandledException {
  constructor() {
    super(PROCESS_STEPS.READ_FILE_FROM_S3, LATEST_FILE_ERROR_MESSAGES.FILE_NOT_FOUND);
    this.name = 'FileNotFoundError';
  }
}
