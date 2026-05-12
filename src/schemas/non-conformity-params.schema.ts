import { StatusNc } from 'enums/status_nc.enum';
import { z } from 'zod';

export const updateStatusParamsSchema = z.object({
  id: z.string().uuid('ID da não conformidade inválido'),
  status: z
    .string()
    .transform(Number)
    .pipe(
      z.enum(StatusNc, {
        message:
          'status deve ser um valor de enum válido: 0 - ABERTA, 1 - EM_TRATAMENTO, 2 - AGUARDANDO_VERIFICACAO, 3 - ENCERRADA, 4 - CANCELADA',
      }),
    ),
});
export type UpdateStatusParams = z.infer<typeof updateStatusParamsSchema>;

export const assignParamsSchema = z.object({
  id: z.string().uuid('ID da não conformidade deve ser um UUID válido'),
});
export type AssignParams = z.infer<typeof assignParamsSchema>;

function isNotPastDate(val: string): boolean {
  const date = new Date(val);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}

export const assignBodySchema = z.object({
  assignedToId: z.string().uuid('ID do usuário deve ser um UUID válido'),
  dueDate: z
    .string()
    .refine((val) => !Number.isNaN(Date.parse(val)), {
      message: 'Data inválida. Use formato ISO 8601 (ex: 2026-04-04T15:30:00Z)',
    })
    .refine(isNotPastDate, { message: 'O prazo não pode ser uma data passada.' }),
});
export type AssignBodyDTO = z.infer<typeof assignBodySchema>;

export const updateDueDateParamsSchema = z.object({
  id: z.string().uuid('ID da não conformidade deve ser um UUID válido'),
  date: z
    .string()
    .refine((val) => !Number.isNaN(Date.parse(val)), {
      message: 'Data inválida. Use formato ISO 8601 (ex: 2026-04-04T15:30:00Z)',
    })
    .refine(isNotPastDate, { message: 'O prazo não pode ser uma data passada.' }),
});
export type UpdateDueDateParams = z.infer<typeof updateDueDateParamsSchema>;
