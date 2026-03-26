export class UserNotFoundError extends Error {
  constructor(
    public message: string = 'Usuário não encontrado!',
    public name: string = 'UserNotFoundError',
  ) {
    super(message);
  }
}
