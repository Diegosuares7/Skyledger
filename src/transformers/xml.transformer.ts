import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { Account } from '../entities/skyledger-transformed-report/account';
import { Amount } from '../entities/skyledger-transformed-report/amount';
import { Journal } from '../entities/skyledger-transformed-report/journal';
import { SkyLedgerReport } from '../entities/skyledger-transformed-report/skyledger-report';
import {
  JournalLocalAmountElement,
  SkyledgerXml,
  Account as XmlAccount,
  Journal as XmlJournal,
} from '../entities/xml/skyledger-xml.entity';
import { FileNotFoundError } from '../xml-parser/exceptions/invalid-path.error';

export const transformXmlToReport = async (
  xml: SkyledgerXml,
  configCompanyCodePath: string,
): Promise<SkyLedgerReport> => {
  const journals = await transformJournals(xml.Ledger.Record.Journal, configCompanyCodePath);
  return { journals };
};

async function transformJournals(xmlJournals: XmlJournal[], configCompanyCodePath: string): Promise<Journal[]> {
  const companyCodeConfigPath = resolve(configCompanyCodePath);
  let codesConfig: { validCodes: string[] };
  try {
    codesConfig = JSON.parse(await readFile(companyCodeConfigPath, 'utf8'));
  } catch (error) {
    throw new FileNotFoundError();
  }
  const filteredJournals = xmlJournals.filter(
    (x) => !isEmpty(x.Accounts.Account) && codesConfig.validCodes.includes(x.CompanyCode),
  );
  return filteredJournals.map((xmlJournal) => transformXmlJournalToJournalReport(xmlJournal));
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
  const debitAmount = parseFloat(xmlAmount.DebitAmount);
  const creditAmount = parseFloat(xmlAmount.CreditAmount);

  if (isNaN(debitAmount) || isNaN(creditAmount)) {
    throw new Error('Invalid debit or credit amount');
  }

  return {
    currencyCode: xmlAmount.CurrencyCode,
    debitAmount,
    creditAmount,
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
  return (
    obj === undefined ||
    obj === null ||
    (Array.isArray(obj) && obj.length === 0) ||
    (typeof obj === 'string' && obj.length === 0) ||
    (typeof obj === 'object' && Object.keys(obj).length === 0)
  );
}
