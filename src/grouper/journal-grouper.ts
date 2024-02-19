import { AccountInfo } from '../entities/grouper/account-info.entity';
import { GroupedJournals } from '../entities/grouper/grouped-journals';
import { KeyGrouper } from '../entities/grouper/key-grouper.entity';
import { SkyLedgerReport } from '../entities/skyledger-transformed-report/skyledger-report';

export function groupJournalsByFileToExport(report: SkyLedgerReport): Map<string, GroupedJournals> {
  const reportMap = new Map<string, GroupedJournals>();
  report.journals.forEach((journal) => {
    const { companyCode, accountPeriod, accounts } = journal;

    accounts.forEach((account) => {
      const { accountName, accountLocalAmounts } = account;

      accountLocalAmounts.forEach((amount) => {
        const { currencyCode, debitAmount, creditAmount } = amount;
        if (!isKeyValid(companyCode, accountPeriod, currencyCode) || !isTransactionValid(debitAmount, creditAmount)) {
          return;
        }
        addAccountRegistryToMap(
          reportMap,
          companyCode,
          currencyCode,
          accountPeriod,
          accountName,
          debitAmount,
          creditAmount,
        );
      });
    });
  });

  return reportMap;
}

function isKeyValid(companyCode: string, accountPeriod: string, currencyCode: string): boolean {
  return !!companyCode && !!accountPeriod && !!currencyCode;
}

function isTransactionValid(debitAmount: number, creditAmount: number): boolean {
  return debitAmount > 0 || creditAmount > 0;
}

function addAccountRegistryToMap(
  reportMap: Map<string, GroupedJournals>,
  companyCode: string,
  currencyCode: string,
  accountPeriod: string,
  accountName: string,
  debitAmount: number,
  creditAmount: number,
): void {
  const keyGrouper: KeyGrouper = {
    companyCode,
    currency: currencyCode,
    accountPeriod,
  };
  const mapKey = generateKeyString(keyGrouper);
  let groupedJournals = reportMap.get(mapKey);
  if (!groupedJournals) {
    const accountsInfo: AccountInfo[] = [];
    groupedJournals = { accountsInfo, keyGrouper };
    reportMap.set(mapKey, groupedJournals);
  }

  groupedJournals.accountsInfo.push({
    debitAmount,
    creditAmount,
    accountName,
  });
}

function generateKeyString(key: KeyGrouper): string {
  return `${key.companyCode}-${key.currency}-${key.accountPeriod}`;
}
