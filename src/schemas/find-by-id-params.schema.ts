import { z } from 'zod';

export const findByIdParamsSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
});
export type FindByIdParams = z.infer<typeof findByIdParamsSchema>;
