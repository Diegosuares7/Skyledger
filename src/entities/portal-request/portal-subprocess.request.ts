import { PortalFileRequest } from './portal-file.request';
import { PortalResponseDtoSubprocessStatusEnum } from './portal-subprocess-status-enum';

export interface PortalSubprocessRequest {
  status: PortalResponseDtoSubprocessStatusEnum;
  name?: string;
  errorDetail: { message: string }[];
  file?: PortalFileRequest;
}
