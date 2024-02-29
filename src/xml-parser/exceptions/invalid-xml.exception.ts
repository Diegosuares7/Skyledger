import { StepProcessHandledException } from '../../exceptions/step-process-handled.exception';
import { PROCESS_STEPS } from '../../exceptions/steps.constants';
import { XML_PARSER_ERROR_MESSAGES } from './xml-parser-messages.constants';

export class InvalidXmlException extends StepProcessHandledException {
  constructor(libraryError: string) {
    super(XML_PARSER_ERROR_MESSAGES.INVALID_XML(libraryError), PROCESS_STEPS.XML_PARSE);
    this.name = 'InvalidXmlError';
  }
}
