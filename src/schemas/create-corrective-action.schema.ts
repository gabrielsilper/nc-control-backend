import { StatusCa } from 'enums/status.enum';
import { z } from 'zod';

export const createCorrectiveActionSchema = z.object({
  description: z
    .string('description é obrigatório e deve ser uma string')
    .min(3, 'description deve ter no mínimo 3 caracteres'),

  status: z.enum(StatusCa, {
    message: 'status deve ser um valor de enum válido: 0 - PENDENTE, 1 - EM_ANDAMENTO, 2 - CONCLUIDA',
  }),

  deadline: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
    message: 'deadline com data inválida. Use formato ISO 8601 (ex: 2026-04-04T15:30:00Z)',
  }),

  evidence: z.string('evidence deve ser uma string').min(3, 'evidence deve ter no mínimo 3 caracteres').optional(),

  assigneeId: z.string('assignedId deve ser uma string').uuid('assignedId deve ser um UUID válido'),
});

export type CreateCorrectiveActionDto = z.infer<typeof createCorrectiveActionSchema>;
