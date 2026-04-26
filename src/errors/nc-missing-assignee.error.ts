export class NcMissingAssigneeError extends Error {
  constructor(
    public message: string = 'A NC ainda não tem um responsável atribuído. Atribua antes de criar ações corretivas.',
    public name: string = 'NcMissingAssigneeError',
  ) {
    super(message);
  }
}
