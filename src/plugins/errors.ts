import { MongooseError, Schema } from 'mongoose';
import { CustomError } from '../services/errorHandler';

export function mongooseErrorHandler(schema: Schema){
  schema.post('save', function(error: MongooseError, doc: any, next: any) {
    if (error) {
      if (error.name === 'MongoServerError' && error.message.includes('duplicate key error')) {
        const duplicatedKey = error.message.split('dup key: { ')[1].split(' }')[0].split(': ')[0];
        next(new CustomError('Chave duplicada: ' + duplicatedKey, 409));
      } else {
        next(new CustomError('Erro desconhecido do banco de dados: ' + error.message, 500));
      }
    } else {
      next();
    }
  });
}