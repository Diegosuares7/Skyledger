import { SAPAccountMapper } from './sap-account-mapper';
import { SAPCompanyMapper } from './sap-company-mapper';
import { SAPMovementMapper } from './sap-movement.mapper';
import { SAPRoundMapper } from './sap-round-mapper';

// Esta interfaz la voy a usar para generar las tablas de mapeos
export interface SAPMapper {
  accountsMappings: Record<string, SAPAccountMapper>;
  movementsMappings: Record<string, SAPMovementMapper>;
  companyMappings: Record<string, SAPCompanyMapper>;
  roundLimitMappings: Record<string, SAPRoundMapper>;
}
