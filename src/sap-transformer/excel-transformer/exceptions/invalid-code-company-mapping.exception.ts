import { PROCESS_STEPS } from '../../../exceptions/steps.constants';
import { StepProcessHandledException } from '../../../exceptions/step-process-handled.exception';
import { EXCEL_TRANSFORMER_ERROR_MESSAGES } from './excel-transformer-error-messages';

export class InvalidSKLCodeCompanyMappingException extends StepProcessHandledException {
  constructor(companyCode: string) {
    super(
      PROCESS_STEPS.GENERATE_EXCEL_REGISTERS,
      EXCEL_TRANSFORMER_ERROR_MESSAGES.INVALID_SKL_COMPANY_CODE(companyCode),
    );
    this.name = 'InvalidCodeCompanyMappingExceptions';
  }
}
