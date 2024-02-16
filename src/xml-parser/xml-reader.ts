import * as fs from 'fs';
import { parseStringPromise } from 'xml2js';
import {
  SkyledgerXml,
  Ledger,
  Journal,
  Account,
  JournalLocalAmountElement,
} from '../entities/xml/skyledger-xml.entity';
import { InvalidXmlError } from './exceptions/invalid-xml.error';
import { FileNotFoundError } from './exceptions/invalid-path.error';

// Definir tipos para el XML parseado
interface ParsedXml {
  Ledger: Ledger;
}

// Función para leer el XML desde un archivo
export async function readXmlFromAssets(path: string): Promise<SkyledgerXml> {
  const xmlData = await readFile(path);
  const parsedData = await parseXml(xmlData);
  const formattedData = formatAccounts(parsedData);
  return formattedData as SkyledgerXml;
}

async function readFile(path: string): Promise<string> {
  try {
    const data = await fs.promises.readFile(path, 'utf-8');
    return data;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new FileNotFoundError();
    }
    throw error;
  }
}

async function parseXml(xmlData: string): Promise<any> {
  try {
    const parsedData = await parseStringPromise(xmlData, { explicitArray: false });
    return parsedData;
  } catch (error) {
    throw new InvalidXmlError();
  }
}

// Creo esta funcion para asegurar el formato de arrays de los xml
function formatAccounts(data: ParsedXml): SkyledgerXml {
  const formattedLedger: Ledger = {
    ...data.Ledger,
    Record: {
      ...data.Ledger.Record,
      // convierto en un array el journal en caso de que venga un solo objeto
      Journal: ensureArray(data.Ledger.Record.Journal).map(formatJournal),
    },
  };
  return { Ledger: formattedLedger };
}

// Función para asegurar que un elemento sea un array
function ensureArray<T>(value: T | T[]): T[] {
  if (value === '') {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

// Función para formatear un diario (journal)
function formatJournal(journal: Journal): Journal {
  return {
    ...journal,
    Accounts: {
      // desactivo esta regla porque el xml me puede devolver un string vacio en el Accounts
      // si es un string vacio lo convierto en un array vacio, si no convierto en un array el account
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      Account: journal.Accounts.Account ? ensureArray(journal.Accounts.Account).map(formatAccount) : [],
    },
  };
}

// Función para formatear una cuenta (account)
function formatAccount(account: Account): Account {
  return {
    ...account,
    AccountLocalAmounts: {
      // desactivo esta regla porque el xml me puede devolver un string vacio en el Accounts
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      AccountLocalAmount: account.AccountLocalAmounts
        ? ensureArray(account.AccountLocalAmounts.AccountLocalAmount).map(formatJournalLocalAmount)
        : [],
    },
  };
}

// Función para formatear un elemento de monto local de un diario (journal local amount element)
function formatJournalLocalAmount(element: JournalLocalAmountElement): JournalLocalAmountElement {
  return { ...element };
}
