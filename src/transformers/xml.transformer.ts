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
import { CompanyCodeNotFoundException } from './exceptions/company-code-config-not-found.exception';
import { handleStepError } from '../exceptions/step-error.handler';
import { PROCESS_STEPS } from '../exceptions/steps.constants';
import { InvalidAmountException } from './exceptions/invalid-amount-exception';

export const transformXmlToReport = async (
  xml: SkyledgerXml,
  configCompanyCodePath: string,
): Promise<SkyLedgerReport> => {
  try {
    const journals = await transformJournals(xml.Ledger.Record.Journal, configCompanyCodePath);
    return { journals };
  } catch (error) {
    throw handleStepError(error, PROCESS_STEPS.XML_TRANSFORM_TO_REPORT);
  }
};

async function transformJournals(xmlJournals: XmlJournal[], configCompanyCodePath: string): Promise<Journal[]> {
  const companyCodeConfigPath = resolve(configCompanyCodePath);
  let codesConfig: { validCodes: string[] };
  try {
    codesConfig = JSON.parse(await readFile(companyCodeConfigPath, 'utf8'));
  } catch (error) {
    throw new CompanyCodeNotFoundException(configCompanyCodePath);
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
    throw new InvalidAmountException(JSON.stringify(xmlAmount));
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
