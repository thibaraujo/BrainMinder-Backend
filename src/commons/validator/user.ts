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
      firstName: z.string(),
      lastName: z.string(),
      email: emailSchema,
      password: z.string().optional(),
      type: z.nativeEnum(UserType),
      permissions: z.record(z.any()).optional(),
      company: idSchema.or(z.object({
        corporateName: z.string(),
        commercialName: z.string(),
        cnpj: z.string(),
        email: emailSchema,
        addresses: z.array(addressSchema),
        phones: z.array(phoneSchema),
      })).optional(),
      cpf: z.string()
        .refine(
          (value: string) => validateCPF(value) === true || validateCNPJ(value),
          {
            message: 'CPF inválido.',
          },
        )
    }),
  }),

  createMe: z.object({
    body: z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      password: z.string(),
      cpf: z
        .string()
        .refine(
          (value: string) => validateCPF(value) === true || validateCPF(value),
          {
            message: 'CPF inválido.',
          },
        ),
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
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z.string().email().optional(),
      type: z.nativeEnum(UserType).optional(),
      permissions: z.object({}).optional(),
      company: idSchema.optional(),
      cpf: z.string()
        .refine(
          (value: string) => validateCPF(value) === true || validateCPF(value),
          {
            message: 'CPF inválido.',
          },
        )
        .optional(),
    }),
  }),

  updateMe: z.object({
    body: z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z.string().email().optional(),
      type: z.nativeEnum(UserType).optional(),
      permissions: z.object({}).optional(),
      company: idSchema.optional(),
      cpf: z.string()
        .refine(
          (value: string) => validateCPF(value) === true || validateCPF(value),
          {
            message: 'CPF inválido.',
          },
        )
        .optional(),
    }),
  }),

  activate: z.object({
    query: z.object({
      id: idSchema,
      activate: activateSchema
    }),
  }),

  login: z
    .object({
      authorization: z.union([
        z.string().regex(/\b(Basic)\b/i),
        z.string().regex(/\b(Bearer)\b/i),
      ]),
    })
    .nonstrict(),

  validatorPasswordDefinitionRequest: z.object({
    query: z.object({
      email: emailSchema,
    }),
  }),

  validatorPasswordDefinition: z.object({
    body: z.object({
      token: z.string(),
      password: z.string(),
    }),
  }),

  validatorEmailValidation: z.object({
    body: z.object({
      token: z.string(),
    }),
  }),
};

export default UserValidator;
