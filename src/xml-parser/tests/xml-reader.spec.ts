import { SkyledgerXml } from '../../entities/xml/skyledger-xml.entity';
import { InvalidXmlException } from '../exceptions/invalid-xml.exception';
import { XmlNotFoundException } from '../exceptions/xml-not-found.exception';
import { readXmlFromAssets } from '../xml-reader';
import * as fs from 'fs';

let result: SkyledgerXml; // Variable para almacenar el resultado de readXmlFromAssets
const rootDir = __dirname;

async function readFile(path: string): Promise<string> {
  try {
    const data = await fs.promises.readFile(path, 'utf-8');
    return data;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new XmlNotFoundException(path);
    }
    throw error;
  }
}
// Pruebo que convierta el tag de account vacio en un array vacio
test('Parseo de cuenta vacia devuelve un array vacio', async () => {
  const xmlPath = rootDir + '/assets/empty-account.xml';
  const xmlData = await readFile(xmlPath);
  result = await readXmlFromAssets(xmlData);
  expect(result.Ledger.Record.Journal[0].Accounts.Account).toEqual([]);
});

// Verifico que convierte el tag de localAmount vacio correctamente en array vacio
test('Parseo de local amount de una cuenta vacio devuelve un array vacio', async () => {
  const xmlPath = rootDir + '/assets/empty-local-amount.xml';
  const xmlData = await readFile(xmlPath);
  result = await readXmlFromAssets(xmlData);
  expect(result.Ledger.Record.Journal[0].Accounts.Account[0].AccountLocalAmounts.AccountLocalAmount).toEqual([]);
});

// Pruebo que parsee corretamente el objeto a un array de un elemento
test('Parseo de una cuenta devuelve un array de un elemento', async () => {
  const xmlPath = rootDir + '/assets/one-account.xml';
  const xmlData = await readFile(xmlPath);
  result = await readXmlFromAssets(xmlData);
  expect(result.Ledger.Record.Journal[0].Accounts.Account.length).toEqual(1);
});

// Pruebo que el segundo account tenga un array vacio de local amounts
test('Parseo de una cuenta con un solo local amount devuelve un array de un elemento', async () => {
  const xmlPath = rootDir + '/assets/one-local-amount.xml';
  const xmlData = await readFile(xmlPath);
  result = await readXmlFromAssets(xmlData);
  expect(result.Ledger.Record.Journal[0].Accounts.Account[0].AccountLocalAmounts.AccountLocalAmount.length).toEqual(1);
});

// Pruebo que el segundo account tenga un array vacio de local amounts
test('Parseo un journal con multiples cuentas y amounts', async () => {
  const xmlPath = rootDir + '/assets/multiple-accounts-amounts.xml';
  const xmlData = await readFile(xmlPath);
  result = await readXmlFromAssets(xmlData);
  expect(result.Ledger.Record.Journal[0].Accounts.Account.length).toEqual(3);
  expect(result.Ledger.Record.Journal[0].Accounts.Account[0].AccountLocalAmounts.AccountLocalAmount.length).toEqual(2);
});

// Pruebo que el segundo account tenga un array vacio de local amounts
test('Parsear un caso real ', async () => {
  const xmlPath = rootDir + '/assets/gl.parser.test.xml';
  const xmlData = await readFile(xmlPath);
  result = await readXmlFromAssets(xmlData);
  expect(result).toBeDefined();
});

// Test for XML parsing error scenario
test('Tira error de parseo de xml si no puede resolver el archivo', async () => {
  const xmlPath = rootDir + '/assets/invalid-xml.xml';
  const xmlData = await readFile(xmlPath);
  await expect(readXmlFromAssets(xmlData)).rejects.toThrow(InvalidXmlException);
});
