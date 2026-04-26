export class CorrectiveActionMissingEvidenceError extends Error {
  constructor(
    public message: string = 'Para concluir a ação corretiva é necessário registrar a evidência.',
    public name: string = 'CorrectiveActionMissingEvidenceError',
  ) {
    super(message);
  }
}
