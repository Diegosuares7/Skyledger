import { SkyLedgerReport } from '../../entities/skyledger-transformed-report/skyledger-report';
import { SkyledgerXml } from '../../entities/xml/skyledger-xml.entity';
import { CompanyCodeNotFoundException } from '../../transformers/exceptions/company-code-config-not-found.exception';
import { InvalidAmountException } from '../../transformers/exceptions/invalid-amount-exception';
import { transformXmlToReport } from '../xml.transformer';

const configCompanyCodePath = __dirname + '/company-code.test.config.json';

describe('transformXmlToReport', () => {
  // Should transform valid XML to a SkyLedgerReport object with journals and date properties
  it('should transform valid XML to a SkyLedgerReport object with journals and date properties', async () => {
    // Mock XML data
    const xmlData: SkyledgerXml = {
      Ledger: {
        Header: {
          Date: '2024-01-01',
          Airline: 'Sample Airline',
        },
        Record: {
          Journal: [
            {
              AccountPeriod: '2024-01',
              CompanyCode: 'JZ',
              JournalEntry: 'Sample Journal Entry 1',
              JournalEntryDescription: 'Description of Journal Entry 1',
              JournalLocalAmounts: {
                JournalLocalAmount: [
                  {
                    CurrencyCode: 'USD',
                    DebitAmount: '100',
                    CreditAmount: '0',
                    TotalAmount: '100',
                  },
                  {
                    CurrencyCode: 'EUR',
                    DebitAmount: '0',
                    CreditAmount: '50',
                    TotalAmount: '50',
                  },
                ],
              },
              HostDebitAmount: '150',
              HostCreditAmount: '50',
              HostTotalAmount: '100',
              HostCurrency: 'USD',
              Accounts: {
                Account: [
                  {
                    AccountName: 'Account 1',
                    AccountDescription: 'Description of Account 1',
                    CenterName: 'Center 1',
                    CenterDescription: 'Description of Center 1',
                    AccountLocalAmounts: {
                      AccountLocalAmount: [
                        {
                          CurrencyCode: 'USD',
                          DebitAmount: '100',
                          CreditAmount: '0',
                          TotalAmount: '100',
                        },
                        {
                          CurrencyCode: 'EUR',
                          DebitAmount: '0',
                          CreditAmount: '50',
                          TotalAmount: '50',
                        },
                      ],
                    },
                    HostCurrency: 'USD',
                    HostDebitAmount: '150',
                    HostCreditAmount: '50',
                    HostTotalAmount: '100',
                  },
                  {
                    AccountName: 'Account 2',
                    AccountDescription: 'Description of Account 2',
                    CenterName: 'Center 2',
                    CenterDescription: 'Description of Center 2',
                    AccountLocalAmounts: {
                      AccountLocalAmount: [
                        {
                          CurrencyCode: 'USD',
                          DebitAmount: '200',
                          CreditAmount: '0',
                          TotalAmount: '200',
                        },
                        {
                          CurrencyCode: 'EUR',
                          DebitAmount: '0',
                          CreditAmount: '100',
                          TotalAmount: '100',
                        },
                      ],
                    },
                    HostCurrency: 'USD',
                    HostDebitAmount: '300',
                    HostCreditAmount: '100',
                    HostTotalAmount: '200',
                  },
                ],
              },
            },
            {
              AccountPeriod: '2024-01',
              CompanyCode: 'JA',
              JournalEntry: 'Sample Journal Entry 2',
              JournalEntryDescription: 'Description of Journal Entry 2',
              JournalLocalAmounts: {
                JournalLocalAmount: [
                  {
                    CurrencyCode: 'USD',
                    DebitAmount: '0',
                    CreditAmount: '75',
                    TotalAmount: '75',
                  },
                  {
                    CurrencyCode: 'EUR',
                    DebitAmount: '0',
                    CreditAmount: '50',
                    TotalAmount: '50',
                  },
                ],
              },
              HostDebitAmount: '75',
              HostCreditAmount: '125',
              HostTotalAmount: '-50',
              HostCurrency: 'USD',
              Accounts: {
                Account: [
                  {
                    AccountName: 'Account 3',
                    AccountDescription: 'Description of Account 3',
                    CenterName: 'Center 3',
                    CenterDescription: 'Description of Center 3',
                    AccountLocalAmounts: {
                      AccountLocalAmount: [
                        {
                          CurrencyCode: 'USD',
                          DebitAmount: '50',
                          CreditAmount: '0',
                          TotalAmount: '50',
                        },
                        {
                          CurrencyCode: 'EUR',
                          DebitAmount: '100',
                          CreditAmount: '0',
                          TotalAmount: '100',
                        },
                      ],
                    },
                    HostCurrency: 'USD',
                    HostDebitAmount: '150',
                    HostCreditAmount: '0',
                    HostTotalAmount: '150',
                  },
                  {
                    AccountName: 'Account 4',
                    AccountDescription: 'Description of Account 4',
                    CenterName: 'Center 4',
                    CenterDescription: 'Description of Center 4',
                    AccountLocalAmounts: {
                      AccountLocalAmount: [
                        {
                          CurrencyCode: 'USD',
                          DebitAmount: '75',
                          CreditAmount: '0',
                          TotalAmount: '75',
                        },
                        {
                          CurrencyCode: 'EUR',
                          DebitAmount: '25',
                          CreditAmount: '0',
                          TotalAmount: '25',
                        },
                      ],
                    },
                    HostCurrency: 'USD',
                    HostDebitAmount: '100',
                    HostCreditAmount: '0',
                    HostTotalAmount: '100',
                  },
                ],
              },
            },
          ],
        },
        Trailer: {
          RecordCount: '2',
        },
      },
    };

    // Expected output
    const expectedReport: SkyLedgerReport = {
      journals: [
        {
          accountPeriod: '2024-01',
          companyCode: 'JZ',
          accounts: [
            {
              accountName: 'Account 1',
              accountDescription: 'Description of Account 1',
              accountLocalAmounts: [
                { currencyCode: 'USD', debitAmount: 100, creditAmount: 0 },
                { currencyCode: 'EUR', debitAmount: 0, creditAmount: 50 },
              ],
            },
            {
              accountName: 'Account 2',
              accountDescription: 'Description of Account 2',
              accountLocalAmounts: [
                { currencyCode: 'USD', debitAmount: 200, creditAmount: 0 },
                { currencyCode: 'EUR', debitAmount: 0, creditAmount: 100 },
              ],
            },
          ],
        },
        {
          accountPeriod: '2024-01',
          companyCode: 'JA',
          accounts: [
            {
              accountName: 'Account 3',
              accountDescription: 'Description of Account 3',
              accountLocalAmounts: [
                { currencyCode: 'USD', debitAmount: 50, creditAmount: 0 },
                { currencyCode: 'EUR', debitAmount: 100, creditAmount: 0 },
              ],
            },
            {
              accountName: 'Account 4',
              accountDescription: 'Description of Account 4',
              accountLocalAmounts: [
                { currencyCode: 'USD', debitAmount: 75, creditAmount: 0 },
                { currencyCode: 'EUR', debitAmount: 25, creditAmount: 0 },
              ],
            },
          ],
        },
      ],
      date: '2024-01-01',
    };

    // Call the function to transform XML to report
    const result = await transformXmlToReport(xmlData, configCompanyCodePath);

    // Check if the result matches the expected output
    expect(result).toEqual(expectedReport);
  });

  // Should throw a CompanyCodeNotFoundException if the company code config file is not found
  it('should throw a CompanyCodeNotFoundException if the company code config file is not found', async () => {
    // Mock XML data
    const xmlData: SkyledgerXml = {
      Ledger: {
        Header: {
          Date: '2024-01-01',
          Airline: 'Sample Airline',
        },
        Record: {
          Journal: [
            {
              AccountPeriod: '2024-01',
              CompanyCode: 'JZ',
              JournalEntry: 'Sample Journal Entry 1',
              JournalEntryDescription: 'Description of Journal Entry 1',
              JournalLocalAmounts: {
                JournalLocalAmount: [
                  {
                    CurrencyCode: 'USD',
                    DebitAmount: '100',
                    CreditAmount: '0',
                    TotalAmount: '100',
                  },
                  {
                    CurrencyCode: 'EUR',
                    DebitAmount: '0',
                    CreditAmount: '50',
                    TotalAmount: '50',
                  },
                ],
              },
              HostDebitAmount: '150',
              HostCreditAmount: '50',
              HostTotalAmount: '100',
              HostCurrency: 'USD',
              Accounts: {
                Account: [
                  {
                    AccountName: 'Account 1',
                    AccountDescription: 'Description of Account 1',
                    CenterName: 'Center 1',
                    CenterDescription: 'Description of Center 1',
                    AccountLocalAmounts: {
                      AccountLocalAmount: [
                        {
                          CurrencyCode: 'USD',
                          DebitAmount: '100',
                          CreditAmount: '0',
                          TotalAmount: '100',
                        },
                        {
                          CurrencyCode: 'EUR',
                          DebitAmount: '0',
                          CreditAmount: '50',
                          TotalAmount: '50',
                        },
                      ],
                    },
                    HostCurrency: 'USD',
                    HostDebitAmount: '150',
                    HostCreditAmount: '50',
                    HostTotalAmount: '100',
                  },
                  {
                    AccountName: 'Account 2',
                    AccountDescription: 'Description of Account 2',
                    CenterName: 'Center 2',
                    CenterDescription: 'Description of Center 2',
                    AccountLocalAmounts: {
                      AccountLocalAmount: [
                        {
                          CurrencyCode: 'USD',
                          DebitAmount: '200',
                          CreditAmount: '0',
                          TotalAmount: '200',
                        },
                        {
                          CurrencyCode: 'EUR',
                          DebitAmount: '0',
                          CreditAmount: '100',
                          TotalAmount: '100',
                        },
                      ],
                    },
                    HostCurrency: 'USD',
                    HostDebitAmount: '300',
                    HostCreditAmount: '100',
                    HostTotalAmount: '200',
                  },
                ],
              },
            },
            {
              AccountPeriod: '2024-01',
              CompanyCode: 'JA',
              JournalEntry: 'Sample Journal Entry 2',
              JournalEntryDescription: 'Description of Journal Entry 2',
              JournalLocalAmounts: {
                JournalLocalAmount: [
                  {
                    CurrencyCode: 'USD',
                    DebitAmount: '0',
                    CreditAmount: '75',
                    TotalAmount: '75',
                  },
                  {
                    CurrencyCode: 'EUR',
                    DebitAmount: '0',
                    CreditAmount: '50',
                    TotalAmount: '50',
                  },
                ],
              },
              HostDebitAmount: '75',
              HostCreditAmount: '125',
              HostTotalAmount: '-50',
              HostCurrency: 'USD',
              Accounts: {
                Account: [
                  {
                    AccountName: 'Account 3',
                    AccountDescription: 'Description of Account 3',
                    CenterName: 'Center 3',
                    CenterDescription: 'Description of Center 3',
                    AccountLocalAmounts: {
                      AccountLocalAmount: [
                        {
                          CurrencyCode: 'USD',
                          DebitAmount: '50',
                          CreditAmount: '0',
                          TotalAmount: '50',
                        },
                        {
                          CurrencyCode: 'EUR',
                          DebitAmount: '100',
                          CreditAmount: '0',
                          TotalAmount: '100',
                        },
                      ],
                    },
                    HostCurrency: 'USD',
                    HostDebitAmount: '150',
                    HostCreditAmount: '0',
                    HostTotalAmount: '150',
                  },
                  {
                    AccountName: 'Account 4',
                    AccountDescription: 'Description of Account 4',
                    CenterName: 'Center 4',
                    CenterDescription: 'Description of Center 4',
                    AccountLocalAmounts: {
                      AccountLocalAmount: [
                        {
                          CurrencyCode: 'USD',
                          DebitAmount: '75',
                          CreditAmount: '0',
                          TotalAmount: '75',
                        },
                        {
                          CurrencyCode: 'EUR',
                          DebitAmount: '25',
                          CreditAmount: '0',
                          TotalAmount: '25',
                        },
                      ],
                    },
                    HostCurrency: 'USD',
                    HostDebitAmount: '100',
                    HostCreditAmount: '0',
                    HostTotalAmount: '100',
                  },
                ],
              },
            },
          ],
        },
        Trailer: {
          RecordCount: '2',
        },
      },
    };

    // Call the function to transform XML to report and expect it to throw a CompanyCodeNotFoundException
    await expect(transformXmlToReport(xmlData, 'nonexistentConfigPath')).rejects.toThrow(CompanyCodeNotFoundException);
  });

  // Should filter out XML journals with empty accounts or invalid company codes
  it('should filter out XML journals with empty accounts or invalid company codes', async () => {
    // Mock the XML data
    const xmlData: SkyledgerXml = {
      Ledger: {
        Header: {
          Date: '2024-01-01',
          Airline: 'Sample Airline',
        },
        Record: {
          Journal: [
            {
              AccountPeriod: '2024-01',
              CompanyCode: 'JZ',
              JournalEntry: 'Sample Journal Entry 1',
              JournalEntryDescription: 'Description of Journal Entry 1',
              JournalLocalAmounts: {
                JournalLocalAmount: [
                  {
                    CurrencyCode: 'USD',
                    DebitAmount: '100',
                    CreditAmount: '0',
                    TotalAmount: '100',
                  },
                  {
                    CurrencyCode: 'EUR',
                    DebitAmount: '0',
                    CreditAmount: '50',
                    TotalAmount: '50',
                  },
                ],
              },
              HostDebitAmount: '150',
              HostCreditAmount: '50',
              HostTotalAmount: '100',
              HostCurrency: 'USD',
              Accounts: {
                Account: [
                  {
                    AccountName: 'Account 1',
                    AccountDescription: 'Description of Account 1',
                    CenterName: 'Center 1',
                    CenterDescription: 'Description of Center 1',
                    AccountLocalAmounts: {
                      AccountLocalAmount: [
                        {
                          CurrencyCode: 'USD',
                          DebitAmount: '100',
                          CreditAmount: '0',
                          TotalAmount: '100',
                        },
                        {
                          CurrencyCode: 'EUR',
                          DebitAmount: '0',
                          CreditAmount: '50',
                          TotalAmount: '50',
                        },
                      ],
                    },
                    HostCurrency: 'USD',
                    HostDebitAmount: '150',
                    HostCreditAmount: '50',
                    HostTotalAmount: '100',
                  },
                  {
                    AccountName: 'Account 2',
                    AccountDescription: 'Description of Account 2',
                    CenterName: 'Center 2',
                    CenterDescription: 'Description of Center 2',
                    AccountLocalAmounts: {
                      AccountLocalAmount: [
                        {
                          CurrencyCode: 'USD',
                          DebitAmount: '200',
                          CreditAmount: '0',
                          TotalAmount: '200',
                        },
                        {
                          CurrencyCode: 'EUR',
                          DebitAmount: '0',
                          CreditAmount: '100',
                          TotalAmount: '100',
                        },
                      ],
                    },
                    HostCurrency: 'USD',
                    HostDebitAmount: '300',
                    HostCreditAmount: '100',
                    HostTotalAmount: '200',
                  },
                ],
              },
            },
            {
              AccountPeriod: '2024-01',
              CompanyCode: 'JA',
              JournalEntry: 'Sample Journal Entry 2',
              JournalEntryDescription: 'Description of Journal Entry 2',
              JournalLocalAmounts: {
                JournalLocalAmount: [
                  {
                    CurrencyCode: 'USD',
                    DebitAmount: '0',
                    CreditAmount: '75',
                    TotalAmount: '75',
                  },
                  {
                    CurrencyCode: 'EUR',
                    DebitAmount: '0',
                    CreditAmount: '50',
                    TotalAmount: '50',
                  },
                ],
              },
              HostDebitAmount: '75',
              HostCreditAmount: '125',
              HostTotalAmount: '-50',
              HostCurrency: 'USD',
              Accounts: {
                Account: [
                  {
                    AccountName: 'Account 3',
                    AccountDescription: 'Description of Account 3',
                    CenterName: 'Center 3',
                    CenterDescription: 'Description of Center 3',
                    AccountLocalAmounts: {
                      AccountLocalAmount: [
                        {
                          CurrencyCode: 'USD',
                          DebitAmount: '50',
                          CreditAmount: '0',
                          TotalAmount: '50',
                        },
                        {
                          CurrencyCode: 'EUR',
                          DebitAmount: '100',
                          CreditAmount: '0',
                          TotalAmount: '100',
                        },
                      ],
                    },
                    HostCurrency: 'USD',
                    HostDebitAmount: '150',
                    HostCreditAmount: '0',
                    HostTotalAmount: '150',
                  },
                  {
                    AccountName: 'Account 4',
                    AccountDescription: 'Description of Account 4',
                    CenterName: 'Center 4',
                    CenterDescription: 'Description of Center 4',
                    AccountLocalAmounts: {
                      AccountLocalAmount: [
                        {
                          CurrencyCode: 'USD',
                          DebitAmount: '75',
                          CreditAmount: '0',
                          TotalAmount: '75',
                        },
                        {
                          CurrencyCode: 'EUR',
                          DebitAmount: '25',
                          CreditAmount: '0',
                          TotalAmount: '25',
                        },
                      ],
                    },
                    HostCurrency: 'USD',
                    HostDebitAmount: '100',
                    HostCreditAmount: '0',
                    HostTotalAmount: '100',
                  },
                ],
              },
            },
          ],
        },
        Trailer: {
          RecordCount: '2',
        },
      },
    };

    const result = await transformXmlToReport(xmlData, configCompanyCodePath);

    // Define the expected output
    const expectedJournals = [
      {
        accountPeriod: '2024-01',
        companyCode: 'JZ',
        accounts: [
          {
            accountName: 'Account 1',
            accountDescription: 'Description of Account 1',
            accountLocalAmounts: [
              { currencyCode: 'USD', debitAmount: 100, creditAmount: 0 },
              { currencyCode: 'EUR', debitAmount: 0, creditAmount: 50 },
            ],
          },
          {
            accountName: 'Account 2',
            accountDescription: 'Description of Account 2',
            accountLocalAmounts: [
              { currencyCode: 'USD', debitAmount: 200, creditAmount: 0 },
              { currencyCode: 'EUR', debitAmount: 0, creditAmount: 100 },
            ],
          },
        ],
      },
      {
        accountPeriod: '2024-01',
        companyCode: 'JA',
        accounts: [
          {
            accountName: 'Account 3',
            accountDescription: 'Description of Account 3',
            accountLocalAmounts: [
              { currencyCode: 'USD', debitAmount: 50, creditAmount: 0 },
              { currencyCode: 'EUR', debitAmount: 100, creditAmount: 0 },
            ],
          },
          {
            accountName: 'Account 4',
            accountDescription: 'Description of Account 4',
            accountLocalAmounts: [
              { currencyCode: 'USD', debitAmount: 75, creditAmount: 0 },
              { currencyCode: 'EUR', debitAmount: 25, creditAmount: 0 },
            ],
          },
        ],
      },
    ];
    const expectedReport = { date: '2024-01-01', journals: expectedJournals };

    // Check if the result matches the expected output
    expect(result).toEqual(expectedReport);
  });

  // Should throw an InvalidAmountException if an XML amount is not a valid number
  it('should throw an InvalidAmountException if an XML amount is not a valid number', async () => {
    // Mock XML data with an invalid amount
    const xmlData: SkyledgerXml = {
      Ledger: {
        Header: {
          Date: '2024-01-01',
          Airline: 'Sample Airline',
        },
        Record: {
          Journal: [
            {
              AccountPeriod: '2024-01',
              CompanyCode: 'JZ',
              JournalEntry: 'Sample Journal Entry 1',
              JournalEntryDescription: 'Description of Journal Entry 1',
              JournalLocalAmounts: {
                JournalLocalAmount: [],
              },
              HostDebitAmount: '150',
              HostCreditAmount: '50',
              HostTotalAmount: '100',
              HostCurrency: 'USD',
              Accounts: {
                Account: [
                  {
                    AccountName: 'Account 1',
                    AccountDescription: 'Description of Account 1',
                    CenterName: 'Center 1',
                    CenterDescription: 'Description of Center 1',
                    AccountLocalAmounts: {
                      AccountLocalAmount: [
                        {
                          CurrencyCode: 'USD',
                          DebitAmount: 'hola',
                          CreditAmount: 'fff',
                          TotalAmount: '100',
                        },
                        {
                          CurrencyCode: 'EUR',
                          DebitAmount: '0',
                          CreditAmount: '50',
                          TotalAmount: '50',
                        },
                      ],
                    },
                    HostCurrency: 'USD',
                    HostDebitAmount: '150',
                    HostCreditAmount: '50',
                    HostTotalAmount: '100',
                  },
                  {
                    AccountName: 'Account 2',
                    AccountDescription: 'Description of Account 2',
                    CenterName: 'Center 2',
                    CenterDescription: 'Description of Center 2',
                    AccountLocalAmounts: {
                      AccountLocalAmount: [
                        {
                          CurrencyCode: 'USD',
                          DebitAmount: '200',
                          CreditAmount: '0',
                          TotalAmount: '200',
                        },
                        {
                          CurrencyCode: 'EUR',
                          DebitAmount: '0',
                          CreditAmount: '100',
                          TotalAmount: '100',
                        },
                      ],
                    },
                    HostCurrency: 'USD',
                    HostDebitAmount: '300',
                    HostCreditAmount: '100',
                    HostTotalAmount: '200',
                  },
                ],
              },
            },
            {
              AccountPeriod: '2024-01',
              CompanyCode: 'JA',
              JournalEntry: 'Sample Journal Entry 2',
              JournalEntryDescription: 'Description of Journal Entry 2',
              JournalLocalAmounts: {
                JournalLocalAmount: [],
              },
              HostDebitAmount: '75',
              HostCreditAmount: '125',
              HostTotalAmount: '-50',
              HostCurrency: 'USD',
              Accounts: {
                Account: [
                  {
                    AccountName: 'Account 3',
                    AccountDescription: 'Description of Account 3',
                    CenterName: 'Center 3',
                    CenterDescription: 'Description of Center 3',
                    AccountLocalAmounts: {
                      AccountLocalAmount: [
                        {
                          CurrencyCode: 'USD',
                          DebitAmount: '50',
                          CreditAmount: '0',
                          TotalAmount: '50',
                        },
                        {
                          CurrencyCode: 'EUR',
                          DebitAmount: '100',
                          CreditAmount: '0',
                          TotalAmount: '100',
                        },
                      ],
                    },
                    HostCurrency: 'USD',
                    HostDebitAmount: '150',
                    HostCreditAmount: '0',
                    HostTotalAmount: '150',
                  },
                  {
                    AccountName: 'Account 4',
                    AccountDescription: 'Description of Account 4',
                    CenterName: 'Center 4',
                    CenterDescription: 'Description of Center 4',
                    AccountLocalAmounts: {
                      AccountLocalAmount: [
                        {
                          CurrencyCode: 'USD',
                          DebitAmount: '7aaa5',
                          CreditAmount: '0',
                          TotalAmount: '75',
                        },
                        {
                          CurrencyCode: 'EUR',
                          DebitAmount: '2fasf5',
                          CreditAmount: '0',
                          TotalAmount: '25',
                        },
                      ],
                    },
                    HostCurrency: 'USD',
                    HostDebitAmount: '100',
                    HostCreditAmount: '0',
                    HostTotalAmount: '100',
                  },
                ],
              },
            },
          ],
        },
        Trailer: {
          RecordCount: '2',
        },
      },
    };

    // Call the function and expect it to throw an InvalidAmountException
    await expect(transformXmlToReport(xmlData, configCompanyCodePath)).rejects.toThrow(InvalidAmountException);
  });

  // Should parse the company code config file and use it to filter out invalid journals
  it('should parse the company code config file and filter out invalid journals', async () => {
    // Mock the data for XML and config file
    const xmlData: SkyledgerXml = {
      Ledger: {
        Header: {
          Date: '2024-01-01',
          Airline: 'Sample Airline',
        },
        Record: {
          Journal: [
            {
              AccountPeriod: '2024-01',
              CompanyCode: 'JZ',
              JournalEntry: 'Sample Journal Entry 1',
              JournalEntryDescription: 'Description of Journal Entry 1',
              JournalLocalAmounts: {
                JournalLocalAmount: [
                  {
                    CurrencyCode: 'USD',
                    DebitAmount: '100',
                    CreditAmount: '0',
                    TotalAmount: '100',
                  },
                  {
                    CurrencyCode: 'EUR',
                    DebitAmount: '0',
                    CreditAmount: '50',
                    TotalAmount: '50',
                  },
                ],
              },
              HostDebitAmount: '150',
              HostCreditAmount: '50',
              HostTotalAmount: '100',
              HostCurrency: 'USD',
              Accounts: {
                Account: [
                  {
                    AccountName: 'Account 1',
                    AccountDescription: 'Description of Account 1',
                    CenterName: 'Center 1',
                    CenterDescription: 'Description of Center 1',
                    AccountLocalAmounts: {
                      AccountLocalAmount: [
                        {
                          CurrencyCode: 'USD',
                          DebitAmount: '100',
                          CreditAmount: '0',
                          TotalAmount: '100',
                        },
                        {
                          CurrencyCode: 'EUR',
                          DebitAmount: '0',
                          CreditAmount: '50',
                          TotalAmount: '50',
                        },
                      ],
                    },
                    HostCurrency: 'USD',
                    HostDebitAmount: '150',
                    HostCreditAmount: '50',
                    HostTotalAmount: '100',
                  },
                  {
                    AccountName: 'Account 2',
                    AccountDescription: 'Description of Account 2',
                    CenterName: 'Center 2',
                    CenterDescription: 'Description of Center 2',
                    AccountLocalAmounts: {
                      AccountLocalAmount: [
                        {
                          CurrencyCode: 'USD',
                          DebitAmount: '200',
                          CreditAmount: '0',
                          TotalAmount: '200',
                        },
                        {
                          CurrencyCode: 'EUR',
                          DebitAmount: '0',
                          CreditAmount: '100',
                          TotalAmount: '100',
                        },
                      ],
                    },
                    HostCurrency: 'USD',
                    HostDebitAmount: '300',
                    HostCreditAmount: '100',
                    HostTotalAmount: '200',
                  },
                ],
              },
            },
            {
              AccountPeriod: '2024-01',
              CompanyCode: 'JB',
              JournalEntry: 'Sample Journal Entry 2',
              JournalEntryDescription: 'Description of Journal Entry 2',
              JournalLocalAmounts: {
                JournalLocalAmount: [
                  {
                    CurrencyCode: 'USD',
                    DebitAmount: '0',
                    CreditAmount: '75',
                    TotalAmount: '75',
                  },
                  {
                    CurrencyCode: 'EUR',
                    DebitAmount: '0',
                    CreditAmount: '50',
                    TotalAmount: '50',
                  },
                ],
              },
              HostDebitAmount: '75',
              HostCreditAmount: '125',
              HostTotalAmount: '-50',
              HostCurrency: 'USD',
              Accounts: {
                Account: [
                  {
                    AccountName: 'Account 3',
                    AccountDescription: 'Description of Account 3',
                    CenterName: 'Center 3',
                    CenterDescription: 'Description of Center 3',
                    AccountLocalAmounts: {
                      AccountLocalAmount: [
                        {
                          CurrencyCode: 'USD',
                          DebitAmount: '50',
                          CreditAmount: '0',
                          TotalAmount: '50',
                        },
                        {
                          CurrencyCode: 'EUR',
                          DebitAmount: '100',
                          CreditAmount: '0',
                          TotalAmount: '100',
                        },
                      ],
                    },
                    HostCurrency: 'USD',
                    HostDebitAmount: '150',
                    HostCreditAmount: '0',
                    HostTotalAmount: '150',
                  },
                  {
                    AccountName: 'Account 4',
                    AccountDescription: 'Description of Account 4',
                    CenterName: 'Center 4',
                    CenterDescription: 'Description of Center 4',
                    AccountLocalAmounts: {
                      AccountLocalAmount: [
                        {
                          CurrencyCode: 'USD',
                          DebitAmount: '75',
                          CreditAmount: '0',
                          TotalAmount: '75',
                        },
                        {
                          CurrencyCode: 'EUR',
                          DebitAmount: '25',
                          CreditAmount: '0',
                          TotalAmount: '25',
                        },
                      ],
                    },
                    HostCurrency: 'USD',
                    HostDebitAmount: '100',
                    HostCreditAmount: '0',
                    HostTotalAmount: '100',
                  },
                ],
              },
            },
          ],
        },
        Trailer: {
          RecordCount: '2',
        },
      },
    };

    // Mock the file system functions
    jest.mock('fs/promises', () => ({
      readFile: jest.fn().mockResolvedValue('{"validCodes": ["JZ", "JA"]}'),
    }));

    // Call the function to transform XML to report
    const result: SkyLedgerReport = await transformXmlToReport(xmlData, configCompanyCodePath);

    // Define the expected output
    const expectedReport: SkyLedgerReport = {
      journals: [
        {
          accountPeriod: '2024-01',
          companyCode: 'JZ',
          accounts: [
            {
              accountName: 'Account 1',
              accountDescription: 'Description of Account 1',
              accountLocalAmounts: [
                { currencyCode: 'USD', debitAmount: 100, creditAmount: 0 },
                { currencyCode: 'EUR', debitAmount: 0, creditAmount: 50 },
              ],
            },
            {
              accountName: 'Account 2',
              accountDescription: 'Description of Account 2',
              accountLocalAmounts: [
                { currencyCode: 'USD', debitAmount: 200, creditAmount: 0 },
                { currencyCode: 'EUR', debitAmount: 0, creditAmount: 100 },
              ],
            },
          ],
        },
      ],
      date: '2024-01-01',
    };

    // Check if the result matches the expected output
    expect(result).toEqual(expectedReport);
  });
});
