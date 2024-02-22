import { handleStepError } from '../exceptions/step-error.handler';
import { AccountInfo } from '../entities/grouper/account-info.entity';
import { GroupedJournals } from '../entities/grouper/grouped-journals';
import { KeyGrouper } from '../entities/grouper/key-grouper.entity';
import { SkyLedgerReport } from '../entities/skyledger-transformed-report/skyledger-report';
import { PROCESS_STEPS } from '../exceptions/steps.constants';

export function groupJournalsByFileToExport(report: SkyLedgerReport): Map<string, GroupedJournals> {
  try {
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
  } catch (error) {
    throw handleStepError(error, PROCESS_STEPS.GROUP_REPORT_TO_FILES);
  }
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
