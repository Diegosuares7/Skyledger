import { Journal } from './journal';

export interface SkyLedgerReport {
  journals: Journal[];
  date: string;
}
