export class InvalidXmlError extends Error {
  constructor() {
    super('el formato del xml es inválido');
    this.name = 'invalid XML';
  }
}
