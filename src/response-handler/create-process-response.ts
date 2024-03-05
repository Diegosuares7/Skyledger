import { PortalRequest } from '../entities/portal-request/portal-process.request';
import { PortalStatusEnum } from '../entities/portal-request/portal-status.enum';
import { PortalResponseDtoSubprocessStatusEnum } from '../entities/portal-request/portal-subprocess-status-enum';
import { PortalSubprocessRequest } from '../entities/portal-request/portal-subprocess.request';
import { SAPExcelFileResult } from './../entities/sap-transformer/excel/sap-excel-file-result.interface';
import { ProcessResponse, ProcessResponseEnum } from './../entities/process-response/process-response.entity';
import { SAPExcelFile } from '../entities/sap-transformer/excel/sap-excel-file.interface';

export function createSuccesResponse(excelFileResults: SAPExcelFileResult[]): ProcessResponse {
  return {
    status: ProcessResponseEnum.SUCCESS,
    portalRequest: getPortalRequest(excelFileResults),
  };
}

export function createErrorResponse(errorMessage: string): ProcessResponse {
  return {
    status: ProcessResponseEnum.ERROR,
    errorMessage,
    portalRequest: {
      name: 'SKL' + new Date().toISOString().slice(0, 12),
      skyledgerSubprocesses: [],
      status: PortalStatusEnum.ERROR,
      error: errorMessage,
    },
  };
}

function getPortalRequest(excelFileResults: SAPExcelFileResult[]): PortalRequest {
  return {
    name: 'SKL' + new Date().toISOString(),
    skyledgerSubprocesses: getSubprocesses(excelFileResults),
    status: getGlobalStatus(excelFileResults),
  };
}
function getSubprocesses(excelFileResults: SAPExcelFileResult[]): PortalSubprocessRequest[] {
  return excelFileResults.map((x: SAPExcelFileResult): PortalSubprocessRequest => {
    return {
      name: x.file?.fileName,
      status: [ProcessResponseEnum.SUCCESS].includes(x.status)
        ? PortalResponseDtoSubprocessStatusEnum.PENDING_APROVAL
        : PortalResponseDtoSubprocessStatusEnum.FAILED,
      errorDetail: getErrors(x.file, x.errorMessage),
      file: x.excelFile
        ? {
            nameFile: x.excelFile.fileName,
            urlBucket: x.excelFile.s3Url!,
            uploadFileToS3: false,
          }
        : undefined,
    };
  });
}
function getGlobalStatus(excelFileResults: SAPExcelFileResult[]): PortalStatusEnum {
  if (excelFileResults.every((x) => x.status === ProcessResponseEnum.SUCCESS)) {
    return PortalStatusEnum.FILES_CREATION_SUCCESS;
  } else if (excelFileResults.some((x) => x.status === ProcessResponseEnum.SUCCESS)) {
    return PortalStatusEnum.FILES_CREATION_WITH_ERRORS;
  } else {
    return PortalStatusEnum.ERROR;
  }
}
function getErrors(file: SAPExcelFile | undefined, errorMessage?: string): { message: string }[] {
  const errors: { message: string }[] = [];
  if (file) {
    file.errors.forEach((x) => {
      errors.push({ message: x.message });
    });
  }
  if (errorMessage) {
    errors.push({ message: errorMessage });
  }
  return errors;
}
