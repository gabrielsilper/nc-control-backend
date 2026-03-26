export class EmailAlreadyExistsError extends Error {
  constructor(message: string = 'Já existe um usuário com este e-mail!') {
    super(message);
  }
}
