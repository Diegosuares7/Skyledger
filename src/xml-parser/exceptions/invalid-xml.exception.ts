import { StepProcessHandledException } from '../../exceptions/step-process-handled.exception';
import { PROCESS_STEPS } from '../../exceptions/steps.constants';

export class InvalidXmlException extends StepProcessHandledException {
  constructor() {
    super('Invalid XML', PROCESS_STEPS.XML_PARSE);
    this.name = 'InvalidXmlError';
  }
}
