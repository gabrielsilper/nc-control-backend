export class UserNotFoundError extends Error {
  constructor(message: string = 'Usuário não encontrado!') {
    super(message);
  }
}
