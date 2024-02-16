export interface SkyledgerXml {
  Ledger: Ledger;
}

export interface Ledger {
  Header: Header;
  Record: Record;
  Trailer: Trailer;
}

export interface Header {
  Date: string;
  Airline: string;
}

export interface Record {
  Journal: Journal[];
}

export interface Journal {
  AccountPeriod: string;
  CompanyCode: string;
  JournalEntry: string;
  JournalEntryDescription: string;
  JournalLocalAmounts: JournalLocalAmountsClass;
  HostDebitAmount: string;
  HostCreditAmount: string;
  HostTotalAmount: string;
  HostCurrency: string;
  Accounts: AccountsClass;
}

export interface AccountsClass {
  Account: Account[];
}

export interface Account {
  AccountName: string;
  AccountDescription: string;
  CenterName: string;
  CenterDescription: string;
  AccountLocalAmounts: AccountLocalAmounts;
  HostCurrency: string;
  HostDebitAmount: string;
  HostCreditAmount: string;
  HostTotalAmount: string;
}

export interface AccountLocalAmounts {
  AccountLocalAmount: JournalLocalAmountElement[];
}

export interface JournalLocalAmountElement {
  CurrencyCode: string;
  DebitAmount: string;
  CreditAmount: string;
  TotalAmount: string;
}

export interface JournalLocalAmountsClass {
  JournalLocalAmount: JournalLocalAmountElement[];
}

export interface Trailer {
  RecordCount: string;
}

export interface XmlParse {
  CompanyCode: string;
  JournalLocalAmounts: JournalLocalAmountElement[];
}
