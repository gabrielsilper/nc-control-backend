import { StatusNc } from 'enums/status_nc.enum';

export class InvalidNonConformityStatusTransitionError extends Error {
  constructor(
    public readonly from: StatusNc,
    public readonly to: StatusNc,
    public name: string = 'InvalidNonConformityStatusTransitionError',
  ) {
    super(`Transição de status da Não conformidade inválido de ${StatusNc[from]} para ${StatusNc[to]}`);
  }
}
