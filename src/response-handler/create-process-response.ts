import { ProcessResponse, ProcessResponseEnum } from './../entities/process-response/process-response.entity';

export function createSuccesResponse(): ProcessResponse {
  return {
    status: ProcessResponseEnum.SUCCESS,
  };
}

export function createErrorResponse(errorMessage: string): ProcessResponse {
  return {
    status: ProcessResponseEnum.ERROR,
    errorMessage,
  };
}
