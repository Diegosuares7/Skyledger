import { StepProcessHandledException } from '../../exceptions/step-process-handled.exception';
import { PROCESS_STEPS } from '../../exceptions/steps.constants';
import { TRANSFORMERS_ERROR_MESSAGES } from './transformers-error-messages.constants';

export class CompanyCodeNotFoundException extends StepProcessHandledException {
  constructor(filePath: string) {
    super(TRANSFORMERS_ERROR_MESSAGES.CONFIG_COMPANY_CODE_NOT_FOUND(filePath), PROCESS_STEPS.XML_TRANSFORM_TO_REPORT);
  }
}
