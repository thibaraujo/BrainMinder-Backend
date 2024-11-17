import * as z from 'zod';
import { UserType } from '../interfaces/user';
import { activateSchema, addressSchema, deletedSchema, emailSchema, idSchema, pageSchema, pageSizeSchema, phoneSchema, searchSchema } from './schemas';
import { validateCPF, validateCNPJ } from '../../services/validateCpfCnpj';

const UserValidator = {
  get: z.object({
    query: z.object({
      id: idSchema.optional(),
      search: searchSchema.optional(),
      page: pageSchema.optional(),
      pageSize: pageSizeSchema.optional(),
      company: idSchema.optional(),
      deleted: deletedSchema.optional(),
    }),
  }),

  create: z.object({
    body: z.object({
      keyWords: z.array(z.string()).optional(),
      title: z.string().optional(),
      sumary: z.string().optional(),
      context: z.string().optional(),
      text: z.string(),
    }),
  }),

  delete: z.object({
    query: z.object({
      id: idSchema
    }),
  }),

  update: z.object({
    query: z.object({
      id: idSchema
    }),
    body: z.object({
      keyWords: z.array(z.string()).optional(),
      title: z.string().optional(),
      sumary: z.string().optional(),
      context: z.string().optional(),
      text: z.string().optional(),
    }),
  }),

  activate: z.object({
    query: z.object({
      id: idSchema,
      activate: activateSchema
    }),
  }),
};

export default UserValidator;
