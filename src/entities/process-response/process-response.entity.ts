import { PortalRequest } from '../portal-request/portal-process.request';

export interface ProcessResponse {
  status: ProcessResponseEnum;
  errorMessage?: string;
  portalRequest: PortalRequest;
}

export enum ProcessResponseEnum {
  SUCCESS = 'success',
  ERROR = 'error',
  ERROR_ROUNDING = 'error_rounding',
}
