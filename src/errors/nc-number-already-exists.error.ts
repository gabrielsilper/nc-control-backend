export class NonConformityNumberAlreadyExistsError extends Error {
  constructor(
    public message: string = 'Já existe uma Não Conformidade com este número cadastrado!',
    public name: string = 'NonConformityNumberAlreadyExistsError',
  ) {
    super(message);
  }
}
