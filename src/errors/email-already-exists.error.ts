export class EmailAlreadyExistsError extends Error {
  constructor(
    public message: string = 'Já existe um usuário com este e-mail!',
    public name: string = 'EmailAlreadyExistsError',
  ) {
    super(message);
  }
}
