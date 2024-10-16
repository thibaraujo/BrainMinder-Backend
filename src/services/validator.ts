import { NextFunction, Response, Request } from 'express';
import { CustomError } from './errorHandler';
import { ZodError, ZodIssue } from 'zod';

const formatZodIssue = (issue: ZodIssue): string => {
  const { path, message } = issue;
  const pathString = path.join('.');
  const atribute = pathString.split('.').pop();
  return `${atribute}: ${message}`;
};

export const formatZodError = (error: ZodError) => {
  const { issues } = error;

  if (issues.length) {
    const currentIssue = issues[0];
    return formatZodIssue(currentIssue);
  }
};

const validate = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
      authorization: req.headers.authorization
    });

    next();
  } catch (err: ZodError | any) {
    return next(new CustomError('Erro de validação - ' + formatZodError(err), 400));
  }
};

export default validate;
