import { StepProcessHandledException } from '../../../exceptions/step-process-handled.exception';
import { PROCESS_STEPS } from '../../../exceptions/steps.constants';
import { EXCEL_TRANSFORMER_ERROR_MESSAGES } from './excel-transformer-error-messages';

export class ExcelEnvVariablesMissingException extends StepProcessHandledException {
  constructor(variables: string) {
    super(PROCESS_STEPS.XML_TRANSFORM_TO_REPORT, EXCEL_TRANSFORMER_ERROR_MESSAGES.ENV_VARIABLES_MISSING(variables));
  }
}
