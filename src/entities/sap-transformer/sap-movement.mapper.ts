export interface SAPMovementMapper {
  accountType: string;
  debit: number;
  credit: number;
  debitCME?: number;
  creditCME?: number;
}
