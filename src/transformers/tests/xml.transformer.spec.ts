import { Journal } from '../../entities/skyledger-transformed-report/journal';
import { SkyLedgerReport } from '../../entities/skyledger-transformed-report/skyledger-report';
import { SkyledgerXml } from '../../entities/xml/skyledger-xml.entity';
import { transformXmlToReport } from '../xml.transformer';

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

describe('transformXmlToReport', () => {
  it('Prueba parseo basica transformacion de entidades', () => {
    // Mock de datos XML de entrada

    const expectedJournals: Journal[] = [
      {
        accountPeriod: '2024-01',
        companyCode: 'JZ',
        accounts: [
          {
            accountName: 'Account 1',
            accountLocalAmounts: [
              { currencyCode: 'USD', debitAmount: 100, creditAmount: 0 },
              { currencyCode: 'EUR', debitAmount: 0, creditAmount: 50 },
            ],
          },
          {
            accountName: 'Account 2',
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
            accountLocalAmounts: [
              { currencyCode: 'USD', debitAmount: 50, creditAmount: 0 },
              { currencyCode: 'EUR', debitAmount: 100, creditAmount: 0 },
            ],
          },
          {
            accountName: 'Account 4',
            accountLocalAmounts: [
              { currencyCode: 'USD', debitAmount: 75, creditAmount: 0 },
              { currencyCode: 'EUR', debitAmount: 25, creditAmount: 0 },
            ],
          },
        ],
      },
    ];

    // Llama a la función para transformar XML a reporte
    const result: SkyLedgerReport = transformXmlToReport(xmlData, __dirname + '/company-code.test.config.json');

    // Comprueba si el resultado es igual al esperado
    expect(result).toEqual({ journals: expectedJournals });
  });
});

it('Modifico un company name para ver si lo filtra de los resultados', () => {
  // Modify company name in XML data
  xmlData.Ledger.Record.Journal[1].CompanyCode = 'JB';

  // Adjust expected output accordingly, removing the modified journal
  const expectedFilteredJournals: Journal[] = [
    {
      accountPeriod: '2024-01',
      companyCode: 'JZ',
      accounts: [
        {
          accountName: 'Account 1',
          accountLocalAmounts: [
            { currencyCode: 'USD', debitAmount: 100, creditAmount: 0 },
            { currencyCode: 'EUR', debitAmount: 0, creditAmount: 50 },
          ],
        },
        {
          accountName: 'Account 2',
          accountLocalAmounts: [
            { currencyCode: 'USD', debitAmount: 200, creditAmount: 0 },
            { currencyCode: 'EUR', debitAmount: 0, creditAmount: 100 },
          ],
        },
      ],
    },
  ];

  // Call the function to transform XML to report
  const filteredResult: SkyLedgerReport = transformXmlToReport(xmlData, __dirname + '/company-code.test.config.json');

  // Check if the result matches the expected filtered output
  expect(filteredResult).toEqual({ journals: expectedFilteredJournals });
});

it('Vuelvo al primer paso, y agrego un journal sin account para ver que lo filtre', () => {
  // Modify XML data to include a journal with an empty account array
  xmlData.Ledger.Record.Journal.push({
    AccountPeriod: '2024-02',
    CompanyCode: 'JZ',
    JournalEntry: 'Sample Journal Entry 3',
    JournalEntryDescription: 'Description of Journal Entry 3',
    JournalLocalAmounts: {
      JournalLocalAmount: [],
    },
    HostDebitAmount: '0',
    HostCreditAmount: '0',
    HostTotalAmount: '0',
    HostCurrency: 'USD',
    Accounts: { Account: [] },
  });

  xmlData.Ledger.Record.Journal[1].CompanyCode = 'JA';

  // Expected Journals should not include the journal with the empty account array
  const expectedJournals: Journal[] = [
    {
      accountPeriod: '2024-01',
      companyCode: 'JZ',
      accounts: [
        {
          accountName: 'Account 1',
          accountLocalAmounts: [
            { currencyCode: 'USD', debitAmount: 100, creditAmount: 0 },
            { currencyCode: 'EUR', debitAmount: 0, creditAmount: 50 },
          ],
        },
        {
          accountName: 'Account 2',
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
          accountLocalAmounts: [
            { currencyCode: 'USD', debitAmount: 50, creditAmount: 0 },
            { currencyCode: 'EUR', debitAmount: 100, creditAmount: 0 },
          ],
        },
        {
          accountName: 'Account 4',
          accountLocalAmounts: [
            { currencyCode: 'USD', debitAmount: 75, creditAmount: 0 },
            { currencyCode: 'EUR', debitAmount: 25, creditAmount: 0 },
          ],
        },
      ],
    },
  ];

  // Call the function to transform XML to report
  const result: SkyLedgerReport = transformXmlToReport(xmlData, __dirname + '/company-code.test.config.json');

  // Check if the result matches the expected output, excluding journals with empty account arrays
  expect(result.journals).toEqual(expectedJournals);
});
