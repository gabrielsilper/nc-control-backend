import { z } from 'zod';

export const createCorrectiveActionParamsSchema = z.object({
  ncId: z.string().uuid('ID da não conformidade deve ser um UUID válido'),
});

export type CreateCorrectiveActionParams = z.infer<typeof createCorrectiveActionParamsSchema>;
