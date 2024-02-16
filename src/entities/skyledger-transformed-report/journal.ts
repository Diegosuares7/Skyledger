import { Account } from './account';

export interface Journal {
  accountPeriod: string;
  companyCode: string;
  accounts: Account[];
}
