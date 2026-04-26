export class CorrectiveActionNotFoundError extends Error {
  constructor(
    public message: string = 'Ação corretiva não encontrada!',
    public name: string = 'CorrectiveActionNotFoundError',
  ) {
    super(message);
  }
}
