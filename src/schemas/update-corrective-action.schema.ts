import { StatusCa } from 'enums/status.enum';
import { z } from 'zod';

export const updateCorrectiveActionSchema = z
  .object({
    status: z
      .enum(StatusCa, {
        message: 'status deve ser um valor de enum válido: 0 - PENDENTE, 1 - EM_ANDAMENTO, 2 - CONCLUIDA',
      })
      .optional(),

    evidence: z.string('evidence deve ser uma string').min(3, 'evidence deve ter no mínimo 3 caracteres').optional(),
  })
  .refine((data) => data.status !== undefined || data.evidence !== undefined, {
    message: 'Informe ao menos status ou evidence',
  });

export type UpdateCorrectiveActionDTO = z.infer<typeof updateCorrectiveActionSchema>;

export const updateCorrectiveActionParamsSchema = z.object({
  ncId: z.string().uuid('ID da não conformidade deve ser um UUID válido'),
  caId: z.string().uuid('ID da ação corretiva deve ser um UUID válido'),
});

export type UpdateCorrectiveActionParams = z.infer<typeof updateCorrectiveActionParamsSchema>;
