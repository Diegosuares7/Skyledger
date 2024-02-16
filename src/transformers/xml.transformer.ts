import { Account } from '../entities/skyledger-transformed-report/account';
import { Amount } from '../entities/skyledger-transformed-report/amount';
import { Journal } from '../entities/skyledger-transformed-report/journal';
import { SkyLedgerReport } from '../entities/skyledger-transformed-report/skyledger-report';
import {
  SkyledgerXml,
  Journal as XmlJournal,
  Account as XmlAccount,
  JournalLocalAmountElement,
} from '../entities/xml/skyledger-xml.entity';

export const transformXmlToReport = (xml: SkyledgerXml): SkyLedgerReport => {
  const journals = transformJournals(xml.Ledger.Record.Journal);
  return { journals };
};

function transformJournals(xmlJournals: XmlJournal[]): Journal[] {
  const journalsFilteredByEmptyAccounts = xmlJournals.filter((x) => !isEmpty(x.Accounts));
  return journalsFilteredByEmptyAccounts.map((xmlJournal) => transformXmlJournalToJournalReport(xmlJournal));
}

function transformXmlJournalToJournalReport(xmlJournal: XmlJournal): Journal {
  const journal: Journal = {} as Journal;
  journal.accountPeriod = xmlJournal.AccountPeriod;
  journal.companyCode = xmlJournal.CompanyCode;
  journal.accounts = isEmpty(xmlJournal.Accounts)
    ? []
    : xmlJournal.Accounts.Account.map((account: XmlAccount) => transformXmlAccountToReportAcount(account));
  return journal;
}

function transformXmlAmountToReportAmount(xmlAmount: JournalLocalAmountElement): Amount {
  return {
    currencyCode: xmlAmount.CurrencyCode,
    debitAmount: parseFloat(xmlAmount.DebitAmount),
    creditAmount: parseFloat(xmlAmount.CreditAmount),
  };
}

function transformXmlAccountToReportAcount(account: XmlAccount): Account {
  return {
    accountName: account.AccountName,
    accountLocalAmounts: isEmpty(account.AccountLocalAmounts)
      ? []
      : account.AccountLocalAmounts.AccountLocalAmount.map((amount: JournalLocalAmountElement) =>
          transformXmlAmountToReportAmount(amount),
        ),
  };
}

function isEmpty(obj: unknown): boolean {
  return obj === undefined || (Array.isArray(obj) && obj.length === 0);
}
