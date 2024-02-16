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
import { readFileSync } from 'fs';
import { resolve } from 'path';

export const transformXmlToReport = (xml: SkyledgerXml, configCompanyCodePath: string): SkyLedgerReport => {
  const journals = transformJournals(xml.Ledger.Record.Journal, configCompanyCodePath);
  return { journals };
};

function transformJournals(xmlJournals: XmlJournal[], configCompanyCodePath: string): Journal[] {
  const journalsFilteredByEmptyAccounts = xmlJournals.filter((x) => !isEmpty(x.Accounts.Account));
  const journalsFilteredByCompanyCode = filterByCompanyCode(journalsFilteredByEmptyAccounts, configCompanyCodePath);
  return journalsFilteredByCompanyCode.map((xmlJournal) => transformXmlJournalToJournalReport(xmlJournal));
}

function filterByCompanyCode(xmlJournals: XmlJournal[], configPath: string): XmlJournal[] {
  const companyCodeConfigPath = resolve(configPath);
  const companyCodeConfig = JSON.parse(readFileSync(companyCodeConfigPath, 'utf8'));
  return xmlJournals.filter((xmlJournal) => companyCodeConfig.validCodes.includes(xmlJournal.CompanyCode));
}

function transformXmlJournalToJournalReport(xmlJournal: XmlJournal): Journal {
  const journal: Journal = {} as Journal;
  journal.accountPeriod = xmlJournal.AccountPeriod;
  journal.companyCode = xmlJournal.CompanyCode;
  journal.accounts = xmlJournal.Accounts.Account.map((account: XmlAccount) =>
    transformXmlAccountToReportAcount(account),
  );
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
