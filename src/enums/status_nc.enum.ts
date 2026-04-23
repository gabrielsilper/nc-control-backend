export enum StatusNc {
  ABERTA,
  EM_TRATAMENTO,
  AGUARDANDO_VERIFICACAO,
  ENCERRADA,
  CANCELADA,
}

export function allowedTransitions(status: StatusNc): StatusNc[] {
  switch (status) {
    case StatusNc.ABERTA:
      return [StatusNc.EM_TRATAMENTO];
    case StatusNc.EM_TRATAMENTO:
      return [StatusNc.AGUARDANDO_VERIFICACAO, StatusNc.CANCELADA];
    case StatusNc.AGUARDANDO_VERIFICACAO:
      return [StatusNc.ENCERRADA, StatusNc.EM_TRATAMENTO];
    default:
      return [];
  }
}
