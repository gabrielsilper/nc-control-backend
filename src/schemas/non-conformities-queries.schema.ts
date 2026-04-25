import { SeverityNc } from 'enums/severity_nc.enum';
import { StatusNc } from 'enums/status_nc.enum';
import { TypeNc } from 'enums/type_nc.enum';
import { z } from 'zod';

const typeValues = Object.values(TypeNc).filter((value) => typeof value === 'number') as number[];
const severityValues = Object.values(SeverityNc).filter((value) => typeof value === 'number') as number[];
const statusValues = Object.values(StatusNc).filter((value) => typeof value === 'number') as number[];
const orderValues = ['ASC', 'DESC'] as const;

export const findNonConformitiesQuerySchema = z.object({
  page: z.coerce.number().int().min(1, 'Page deve ser maior ou igual a 1').default(1),
  pageSize: z.coerce.number().int().min(1, 'Page size deve ser maior ou igual a 1').default(10),
  order: z.enum(orderValues).default('ASC'),
  type: z.coerce
    .number()
    .int()
    .optional()
    .refine((value) => value === undefined || typeValues.includes(value), {
      message: `Type deve ser um dos valores: ${typeValues.join(', ')}`,
    }),
  severity: z.coerce
    .number()
    .int()
    .optional()
    .refine((value) => value === undefined || severityValues.includes(value), {
      message: `Severity deve ser um dos valores: ${severityValues.join(', ')}`,
    }),
  status: z.coerce
    .number()
    .int()
    .optional()
    .refine((value) => value === undefined || statusValues.includes(value), {
      message: `Status deve ser um dos valores: ${statusValues.join(', ')}`,
    }),
  assignedToId: z.string().uuid('assignedToId deve ser um UUID válido').optional(),
  expired: z.coerce
    .number()
    .int()
    .refine((value) => value === 0 || value === 1, {
      message: 'expired deve ser 0 ou 1',
    })
    .transform((value) => value === 1)
    .optional(),
  search: z.string().trim().optional(),
});

export type FindNonConformitiesQuery = z.infer<typeof findNonConformitiesQuerySchema>;

export const rankingLimitQuerySchema = z.object({
  limit: z.coerce.number().int().min(1, 'Limit deve ser maior ou igual a 1').default(3),
});

export type RankingLimitQuery = z.infer<typeof rankingLimitQuerySchema>;
