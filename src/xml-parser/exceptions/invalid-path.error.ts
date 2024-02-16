export class FileNotFoundError extends Error {
  constructor() {
    super('el path del archivo xml es inválido');
    this.name = 'file not found';
  }
}
