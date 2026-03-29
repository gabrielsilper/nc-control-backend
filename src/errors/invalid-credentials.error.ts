export class InvalidCredentialsError extends Error {
  constructor(
    public message: string = 'Credênciais inválidas!',
    public name: string = 'InvalidCredentialsError',
  ) {
    super(message);
  }
}
