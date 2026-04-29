export class NonConformityMissingAssignmentRequirementsError extends Error {
  constructor(
    public message: string = 'Responsável e prazo são obrigatórios antes de colocar a NC em tratamento.',
    public name: string = 'NonConformityMissingAssignmentRequirementsError',
  ) {
    super(message);
  }
}
