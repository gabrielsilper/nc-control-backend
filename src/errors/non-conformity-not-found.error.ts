export class NonConformityNotFoundError extends Error {
  constructor(
    public message: string = 'Não conformidade não encontrada!',
    public name: string = 'NonConformityNotFoundError',
  ) {
    super(message);
  }
}
