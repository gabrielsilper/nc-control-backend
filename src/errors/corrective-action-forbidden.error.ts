export class CorrectiveActionForbiddenError extends Error {
  constructor(
    public message: string = 'Somente o responsável atual da NC ou um gestor pode alterar este plano de ação.',
    public name: string = 'CorrectiveActionForbiddenError',
  ) {
    super(message);
  }
}
