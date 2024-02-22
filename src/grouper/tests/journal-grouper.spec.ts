import { SkyLedgerReport } from '../../entities/skyledger-transformed-report/skyledger-report';
import { groupJournalsByFileToExport } from '../journal-grouper';

describe('groupJournalsByFileToExport', () => {
  // Given a valid SkyLedgerReport object with journals and accounts, the function should group the journals by company code, currency, and account period, and return a Map object with the grouped journals.
  it('should group journals by company code, currency, and account period', () => {
    // Arrange
    const report: SkyLedgerReport = {
      journals: [
        {
          companyCode: 'ABC',
          accountPeriod: '2021-01',
          accounts: [
            {
              accountName: 'Account 1',
              accountLocalAmounts: [
                {
                  currencyCode: 'USD',
                  debitAmount: 100,
                  creditAmount: 0,
                },
                {
                  currencyCode: 'USD',
                  debitAmount: 0,
                  creditAmount: 200,
                },
              ],
            },
            {
              accountName: 'Account 2',
              accountLocalAmounts: [
                {
                  currencyCode: 'USD',
                  debitAmount: 300,
                  creditAmount: 0,
                },
                {
                  currencyCode: 'EUR',
                  debitAmount: 0,
                  creditAmount: 400,
                },
              ],
            },
          ],
        },
        {
          companyCode: 'ABC',
          accountPeriod: '2021-01',
          accounts: [
            {
              accountName: 'Account 3',
              accountLocalAmounts: [
                {
                  currencyCode: 'USD',
                  debitAmount: 500,
                  creditAmount: 0,
                },
              ],
            },
          ],
        },
        {
          companyCode: 'XYZ',
          accountPeriod: '2021-02',
          accounts: [
            {
              accountName: 'Account 4',
              accountLocalAmounts: [
                {
                  currencyCode: 'USD',
                  debitAmount: 0,
                  creditAmount: 600,
                },
              ],
            },
          ],
        },
      ],
    };

    // Act
    const result = groupJournalsByFileToExport(report);

    // Assert
    expect(result.size).toBe(3);
    expect(result.get('ABC-USD-2021-01')).toEqual({
      keyGrouper: {
        companyCode: 'ABC',
        currency: 'USD',
        accountPeriod: '2021-01',
      },
      accountsInfo: [
        {
          debitAmount: 100,
          creditAmount: 0,
          accountName: 'Account 1',
        },
        {
          debitAmount: 0,
          creditAmount: 200,
          accountName: 'Account 1',
        },
        {
          debitAmount: 300,
          creditAmount: 0,
          accountName: 'Account 2',
        },
        {
          debitAmount: 500,
          creditAmount: 0,
          accountName: 'Account 3',
        },
      ],
    });
    expect(result.get('ABC-EUR-2021-01')).toEqual({
      keyGrouper: {
        companyCode: 'ABC',
        currency: 'EUR',
        accountPeriod: '2021-01',
      },
      accountsInfo: [
        {
          debitAmount: 0,
          creditAmount: 400,
          accountName: 'Account 2',
        },
      ],
    });
    expect(result.get('XYZ-USD-2021-02')).toEqual({
      keyGrouper: {
        companyCode: 'XYZ',
        currency: 'USD',
        accountPeriod: '2021-02',
      },
      accountsInfo: [
        {
          debitAmount: 0,
          creditAmount: 600,
          accountName: 'Account 4',
        },
      ],
    });
  });

  // If a journal has multiple accounts with the same company code, currency, and account period, the function should group all the accounts under the same key in the Map object.
  it('should group multiple accounts under the same key', () => {
    // Arrange
    const report: SkyLedgerReport = {
      journals: [
        {
          companyCode: 'ABC',
          accountPeriod: '2021-01',
          accounts: [
            {
              accountName: 'Account 1',
              accountLocalAmounts: [
                {
                  currencyCode: 'USD',
                  debitAmount: 100,
                  creditAmount: 0,
                },
              ],
            },
            {
              accountName: 'Account 2',
              accountLocalAmounts: [
                {
                  currencyCode: 'USD',
                  debitAmount: 200,
                  creditAmount: 0,
                },
              ],
            },
          ],
        },
      ],
    };

    // Act
    const result = groupJournalsByFileToExport(report);

    // Assert
    expect(result.size).toBe(1);
    expect(result.get('ABC-USD-2021-01')).toEqual({
      keyGrouper: {
        companyCode: 'ABC',
        currency: 'USD',
        accountPeriod: '2021-01',
      },
      accountsInfo: [
        {
          debitAmount: 100,
          creditAmount: 0,
          accountName: 'Account 1',
        },
        {
          debitAmount: 200,
          creditAmount: 0,
          accountName: 'Account 2',
        },
      ],
    });
  });

  // If a journal has multiple accountLocalAmounts with the same currency, the function should group all the amounts under the same account in the AccountInfo array.
  it('should group multiple amounts under the same account', () => {
    // Arrange
    const report: SkyLedgerReport = {
      journals: [
        {
          companyCode: 'ABC',
          accountPeriod: '2021-01',
          accounts: [
            {
              accountName: 'Account 1',
              accountLocalAmounts: [
                {
                  currencyCode: 'USD',
                  debitAmount: 100,
                  creditAmount: 0,
                },
                {
                  currencyCode: 'USD',
                  debitAmount: 0,
                  creditAmount: 200,
                },
              ],
            },
          ],
        },
      ],
    };

    // Act
    const result = groupJournalsByFileToExport(report);

    // Assert
    expect(result.size).toBe(1);
    expect(result.get('ABC-USD-2021-01')).toEqual({
      keyGrouper: {
        companyCode: 'ABC',
        currency: 'USD',
        accountPeriod: '2021-01',
      },
      accountsInfo: [
        {
          debitAmount: 100,
          creditAmount: 0,
          accountName: 'Account 1',
        },
        {
          debitAmount: 0,
          creditAmount: 200,
          accountName: 'Account 1',
        },
      ],
    });
  });

  // If the SkyLedgerReport object is empty, the function should return an empty Map object.
  it('should return an empty Map object when the report is empty', () => {
    // Arrange
    const report: SkyLedgerReport = {
      journals: [],
    };

    // Act
    const result = groupJournalsByFileToExport(report);

    // Assert
    expect(result.size).toBe(0);
  });

  // If a journal has no accounts, the function should not add any entry to the Map object.
  it('should not add any entry to the Map object when a journal has no accounts', () => {
    // Arrange
    const report: SkyLedgerReport = {
      journals: [
        {
          companyCode: 'ABC',
          accountPeriod: '2021-01',
          accounts: [],
        },
      ],
    };

    // Act
    const result = groupJournalsByFileToExport(report);

    // Assert
    expect(result.size).toBe(0);
  });

  // If a journal has accounts with no accountLocalAmounts, the function should not add any entry to the AccountInfo array.
  it('should not add any entry to the AccountInfo array when a journal has accounts with no accountLocalAmounts', () => {
    // Arrange
    const report: SkyLedgerReport = {
      journals: [
        {
          companyCode: 'ABC',
          accountPeriod: '2021-01',
          accounts: [
            {
              accountName: 'Account 1',
              accountLocalAmounts: [],
            },
          ],
        },
      ],
    };

    // Act
    const result = groupJournalsByFileToExport(report);

    // Assert
    expect(result.size).toBe(0);
  });

  // If a journal has accountLocalAmounts with both debit and credit amounts, the function should add the account to the AccountInfo array only if at least one of the amounts is greater than zero.
  it('should add the account to the AccountInfo array only if at least one of the amounts is greater than zero', () => {
    // Arrange
    const report: SkyLedgerReport = {
      journals: [
        {
          companyCode: 'ABC',
          accountPeriod: '2021-01',
          accounts: [
            {
              accountName: 'Account 1',
              accountLocalAmounts: [
                {
                  currencyCode: 'USD',
                  debitAmount: 0,
                  creditAmount: 0,
                },
                {
                  currencyCode: 'USD',
                  debitAmount: 0,
                  creditAmount: 200,
                },
              ],
            },
            {
              accountName: 'Account 2',
              accountLocalAmounts: [
                {
                  currencyCode: 'USD',
                  debitAmount: 300,
                  creditAmount: 0,
                },
                {
                  currencyCode: 'USD',
                  debitAmount: 0,
                  creditAmount: 0,
                },
              ],
            },
          ],
        },
      ],
    };

    // Act
    const result = groupJournalsByFileToExport(report);

    // Assert
    expect(result.size).toBe(1);
    expect(result.get('ABC-USD-2021-01')).toEqual({
      keyGrouper: {
        companyCode: 'ABC',
        currency: 'USD',
        accountPeriod: '2021-01',
      },
      accountsInfo: [
        {
          debitAmount: 0,
          creditAmount: 200,
          accountName: 'Account 1',
        },
        {
          debitAmount: 300,
          creditAmount: 0,
          accountName: 'Account 2',
        },
      ],
    });
  });

  // If a journal has accountLocalAmounts with only debit or credit amounts, the function should add the account to the AccountInfo array regardless of the amount value.
  it('should add the account to the AccountInfo array regardless of the amount value when a journal has accountLocalAmounts with only debit or credit amounts', () => {
    // Arrange
    const report: SkyLedgerReport = {
      journals: [
        {
          companyCode: 'ABC',
          accountPeriod: '2021-01',
          accounts: [
            {
              accountName: 'Account 1',
              accountLocalAmounts: [
                {
                  currencyCode: 'USD',
                  debitAmount: 100,
                  creditAmount: 0,
                },
              ],
            },
            {
              accountName: 'Account 2',
              accountLocalAmounts: [
                {
                  currencyCode: 'USD',
                  debitAmount: 300,
                  creditAmount: 0,
                },
                {
                  currencyCode: 'EUR',
                  debitAmount: 0,
                  creditAmount: 400,
                },
              ],
            },
          ],
        },
      ],
    };

    // Act
    const result = groupJournalsByFileToExport(report);

    // Assert
    expect(result.size).toBe(2);
    expect(result.get('ABC-USD-2021-01')).toEqual({
      keyGrouper: {
        companyCode: 'ABC',
        currency: 'USD',
        accountPeriod: '2021-01',
      },
      accountsInfo: [
        {
          debitAmount: 100,
          creditAmount: 0,
          accountName: 'Account 1',
        },
        {
          debitAmount: 300,
          creditAmount: 0,
          accountName: 'Account 2',
        },
      ],
    });
    expect(result.get('ABC-EUR-2021-01')).toEqual({
      keyGrouper: {
        companyCode: 'ABC',
        currency: 'EUR',
        accountPeriod: '2021-01',
      },
      accountsInfo: [
        {
          debitAmount: 0,
          creditAmount: 400,
          accountName: 'Account 2',
        },
      ],
    });
  });
});
