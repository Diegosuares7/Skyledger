import * as yup from 'yup';

const accountsSchema = yup.object().shape({
  SLAccount: yup.string().required(),
  SAPAccount: yup.string().required(),
  AccountType: yup.string().required(),
  CME: yup.string().notRequired(),
  CostCenter: yup.string().notRequired(),
});

const movementsSchema = yup.object().shape({
  accountType: yup.string().required(),
  debit: yup.number().required(),
  credit: yup.number().required(),
  debitCME: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .nullable(),
  creditCME: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .nullable(),
});

const companySchema = yup.object().shape({
  SLCompanyCode: yup.string().required(),
  SAPCompanyCode: yup.string().required(),
});

export { accountsSchema, movementsSchema, companySchema };
