import { Profile } from 'enums/profile.enum';
import { z } from 'zod';

const profileValues = Object.values(Profile).filter((v) => typeof v === 'number') as number[];

export const findUsersQuerySchema = z.object({
  profile: z.coerce
    .number()
    .int()
    .optional()
    .refine((v) => v === undefined || profileValues.includes(v), {
      message: `Profile deve ser um dos valores: ${profileValues.join(', ')}`,
    }),
  search: z.string().trim().optional(),
});

export type FindUsersQuery = z.infer<typeof findUsersQuerySchema>;
