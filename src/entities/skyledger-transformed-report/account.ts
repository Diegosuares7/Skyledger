import { Amount } from './amount';

export interface Account {
  accountName: string;
  accountLocalAmounts: Amount[];
}
