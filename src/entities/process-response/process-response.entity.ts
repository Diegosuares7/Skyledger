export interface ProcessResponse {
  status: ProcessResponseEnum;
  errorMessage?: string;
  metadata?: Record<string, string>;
}

export enum ProcessResponseEnum {
  SUCCESS = 'success',
  ERROR = 'error',
  SUCCESS_WITH_ERRORS = 'success_with_errors',
}
