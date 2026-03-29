export function getEnvOrThrow(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variável de ambiente ${name} não definida`);
  }
  return value;
}

export function getEnvNumberOrThrow(name: string): number {
  const value = getEnvOrThrow(name);
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) {
    throw new Error(`Variável de ambiente ${name} deve ser um número. Valor atual: ${value}`);
  }
  return numberValue;
}
