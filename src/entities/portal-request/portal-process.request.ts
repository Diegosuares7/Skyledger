import { PortalStatusEnum } from './portal-status.enum';
import { PortalSubprocessRequest } from './portal-subprocess.request';

export interface PortalRequest {
  status: PortalStatusEnum;
  name: string;
  skyledgerSubprocesses: PortalSubprocessRequest[];
  error?: string;
}
