import { StatusNc } from 'enums/status_nc.enum';
import { z } from 'zod';

export const updateStatusParamsSchema = z.object({
  id: z.string().uuid('ID da não conformidade inválido'),
  status: z.enum(StatusNc, {
    message:
      'status deve ser um valor de enum válido: 0 - ABERTA, 1 - EM_TRABALHO, 2 - AGUARDANDO, 3 - VERIFICACAO, 4 - ENCERRADA, 5 - CANCELADA',
  }),
});
export type UpdateStatusParams = z.infer<typeof updateStatusParamsSchema>;

export const assignParamsSchema = z.object({
  id: z.string().uuid('ID da não conformidade deve ser um UUID válido'),
  userId: z.string().uuid('ID do usuário deve ser um UUID válido'),
});
export type AssignParams = z.infer<typeof assignParamsSchema>;

export const updateDueDateParamsSchema = z.object({
  id: z.string().uuid('ID da não conformidade deve ser um UUID válido'),
  date: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
    message: 'Data inválida. Use formato ISO 8601 (ex: 2026-04-04T15:30:00Z)',
  }),
});
export type UpdateDueDateParams = z.infer<typeof updateDueDateParamsSchema>;
