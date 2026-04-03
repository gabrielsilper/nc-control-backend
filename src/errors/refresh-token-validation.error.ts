export default class RefreshTokenValidationError extends Error {
  constructor(
    public message: string = 'Falha na validação do refresh token!',
    public name: string = 'RefreshTokenValidationError',
  ) {
    super(message);
  }
}
