export class CorrectiveActionForbiddenError extends Error {
  constructor(
    public message: string = 'Apenas o responsável atribuído pode atualizar essa ação corretiva.',
    public name: string = 'CorrectiveActionForbiddenError',
  ) {
    super(message);
  }
}
