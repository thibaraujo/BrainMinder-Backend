import { NextFunction, Request, Response } from 'express';
import { CelebrateError } from 'celebrate';

export const customMessages = {
  'string.base': '{#label} deve ser uma string',
  'string.empty': '{#label} não pode estar vazio',
  'string.email': 'E-mail inválido.',
  'string.regex.base': '{#label} não está no formato correto',
  'string.min': '{#label} deve ter pelo menos {#limit} caracteres',
  'string.max': '{#label} deve ter no máximo {#limit} caracteres',
  'any.required': '{#label} é um campo obrigatório',
  'string.allow': '{#label} não é permitido',
  'string.uri': '{#label} deve ser uma URL válida',
  'string.case': '{#label} deve estar em maiúsculas/minúsculas',

  // Numeric validation errors
  'number.base': '{#label} deve ser um número',
  'number.min': '{#label} deve ser no mínimo {#limit}',
  'number.max': '{#label} deve ser no máximo {#limit}',
  'number.integer': '{#label} deve ser um número inteiro',
  'number.positive': '{#label} deve ser um número positivo',
  'number.negative': '{#label} deve ser um número negativo',

  // Date validation errors
  'date.base': '{#label} deve ser uma data válida',
  'date.format': '{#label} não está no formato correto',

  // Array validation errors
  'array.base': '{#label} deve ser um array',
  'array.min': '{#label} deve ter no mínimo {#limit} itens',
  'array.max': '{#label} deve ter no máximo {#limit} itens',
  'array.unique': 'Os itens em {#label} devem ser únicos',

  // Object validation errors
  'object.base': '{#label} deve ser um objeto',
  'object.unknown': '{#label} não é permitido',

  // any
  'cpf.custom': 'CPF inválido.',
  'any.invalid': '{#label} não é permitido',
  'any.unknown': '{#label} não é esperado'
};

export function celebrateErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  //* Verifica se o erro é um CelebrateError
  if (err instanceof CelebrateError) {
    const errors: { [key: string]: string } = {};
    //* Itera sobre cada detalhe do erro armazenado em um Map
    err.details.forEach((detail) =>
      detail.details.forEach((error) =>
        errors[error.context?.key || 'error'] = error.message
      )
    );

    //* Monta a resposta de erro
    const success = false;
    const errorsString = Object.values(errors).join(', ');
    const message = 'Dados inválidos: ' + errorsString;
    const statusCode = 400;

    return res.status(statusCode).json({ success, message, statusCode, errors });
  }

  //* Se não for um erro do Celebrate, passa para o próximo middleware de erro
  next(err);
}