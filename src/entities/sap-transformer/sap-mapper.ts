import { SAPAccountMapper } from './sap-account-mapper';
import { SAPCompanyMapper } from './sap-company-mapper';
import { SAPMovementMapper } from './sap-movement.mapper';

export interface SAPMapper {
  accountsMappings: SAPAccountMapper[];
  movementsMappings: SAPMovementMapper[];
  companyMappings: SAPCompanyMapper[];
}
