import { StepProcessHandledException } from '../../../exceptions/step-process-handled.exception';
import { PROCESS_STEPS } from '../../../exceptions/steps.constants';
import { EXCEL_TRANSFORMER_ERROR_MESSAGES } from './excel-transformer-error-messages';

export class InvalidCMECodeException extends StepProcessHandledException {
  constructor(accountType: string) {
    super(PROCESS_STEPS.GENERATE_EXCEL_REGISTERS, EXCEL_TRANSFORMER_ERROR_MESSAGES.INVALID_CME_CODE(accountType));
    this.name = 'InvalidCmeCode';
  }
}
