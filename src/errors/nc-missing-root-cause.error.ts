export class NonConformityMissingRootCauseError extends Error {
  constructor(public name: string = 'NonConformityMissingRootCauseError') {
    super('Causa raiz é obrigatória para encerrar uma não conformidade');
  }
}
