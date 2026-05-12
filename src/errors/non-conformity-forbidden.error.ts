export class NonConformityForbiddenError extends Error {
  constructor(
    public message: string = 'Somente o responsável atribuído à NC ou um gestor pode realizar esta ação.',
    public name: string = 'NonConformityForbiddenError',
  ) {
    super(message);
  }
}
