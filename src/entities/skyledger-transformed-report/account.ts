import { Amount } from './amount';

export interface Account {
  accountName: string;
  accountDescription: string;
  accountLocalAmounts: Amount[];
}
