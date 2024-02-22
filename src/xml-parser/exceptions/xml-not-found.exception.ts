import { StepProcessHandledException } from '../../exceptions/step-process-handled.exception';
import { PROCESS_STEPS } from '../../exceptions/steps.constants';
import { XML_PARSER_ERROR_MESSAGES } from './xml-parser-messages.constants';

export class XmlNotFoundException extends StepProcessHandledException {
  constructor(path: string) {
    super(XML_PARSER_ERROR_MESSAGES.XML_FILE_NOT_FOUND(path), PROCESS_STEPS.XML_PARSE);
    this.name = 'XmlNotFoundError';
  }
}
