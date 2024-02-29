import { PROCESS_STEPS } from '../../exceptions/steps.constants';
import { StepProcessHandledException } from '../../exceptions/step-process-handled.exception';
import { ROUNDING_VALIDATION_ERROR_MESSAGES } from './rounding-validation-error-messages';

export class InvalidCurrencyForRoundingException extends StepProcessHandledException {
  constructor(currencyCode: string) {
    super(ROUNDING_VALIDATION_ERROR_MESSAGES.INVALID_CURRENCY_MAP(currencyCode), PROCESS_STEPS.ROUNDING_VALIDATION);
  }
}
