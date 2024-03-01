import { AccountInfo } from './account-info.entity';
import { KeyGrouper } from './key-grouper.entity';

export interface GroupedJournals {
  keyGrouper: KeyGrouper;
  accountsInfo: AccountInfo[];
  entryDate: string;
}
