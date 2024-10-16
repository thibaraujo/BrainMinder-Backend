import mongoose from 'mongoose';
import { z } from 'zod';

export const idSchema = z.custom<mongoose.Types.ObjectId>();

export const searchSchema = z.string();

export const cnpjSchema = z.string();

export const pageSchema = z.coerce.number().min(1);

export const pageSizeSchema = z.coerce.number().min(1);

export const deletedSchema = z.coerce.boolean();

export const activateSchema = z.coerce.boolean();

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
export const emailSchema = z.string().email().regex(emailRegex);

export const phoneSchema = z.object({
  number: z.string().min(10, 'O número deve ter pelo menos 10 dígitos').max(15, 'O número deve ter no máximo 15 dígitos'),
  title: z.string().min(1, 'O título é obrigatório')
});

export const addressSchema = z.object({
  street: z.string().min(1, 'A rua é obrigatória'),
  number: z.string().min(1, 'O número é obrigatório'),
  complement: z.string().optional(), // O complemento pode ser opcional
  city: z.string().min(1, 'A cidade é obrigatória'),
  state: z.string().length(2, 'O estado deve ter 2 caracteres'), // Considerando siglas de estados brasileiros
  zipcode: z.string().min(8, 'O CEP deve ter pelo menos 8 caracteres').max(9, 'O CEP deve ter no máximo 9 caracteres'),
  neighborhood: z.string().min(1, 'O bairro é obrigatório')
});