import { z } from 'zod';
import { deletedSchema, idSchema, pageSchema, pageSizeSchema } from './schemas';

const ConfigValidator = {
  get: z.object({
    query: z.object({
      id: idSchema.optional(),
      option: z.string().optional().or(z.literal('')), // Permite string vazia ou undefined
      page: pageSchema.optional(),
      pageSize: pageSizeSchema.optional(),
      deleted: deletedSchema.optional(),
    }),
  }),

  create: z.object({
    query: z.object({ option: z.string() }),
    body: z.object({})
  })
};

export default ConfigValidator;