import { StepProcessHandledException } from '../../exceptions/step-process-handled.exception';
import { PROCESS_STEPS } from '../../exceptions/steps.constants';
import { TRANSFORMERS_ERROR_MESSAGES } from './transformers-error-messages.constants';

export class InvalidAmountException extends StepProcessHandledException {
  constructor(invalidRow: string) {
    super(TRANSFORMERS_ERROR_MESSAGES.INVALID_AMOUNT(invalidRow), PROCESS_STEPS.XML_TRANSFORM_TO_REPORT);
  }
}
