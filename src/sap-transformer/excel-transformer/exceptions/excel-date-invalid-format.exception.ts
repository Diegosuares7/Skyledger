import { StepProcessHandledException } from '../../../exceptions/step-process-handled.exception';
import { PROCESS_STEPS } from '../../../exceptions/steps.constants';
import { EXCEL_TRANSFORMER_ERROR_MESSAGES } from './excel-transformer-error-messages';

export class ExcelDateInvalidFormatException extends StepProcessHandledException {
  constructor() {
    super(PROCESS_STEPS.GENERATE_EXCEL_REGISTERS, EXCEL_TRANSFORMER_ERROR_MESSAGES.INVALID_FORMAT_DATE);
    this.name = 'ExcelDateInvalidFormatException';
  }
}
