'use strict';

import {ConfigModel} from '../models/config';
import { NextFunction, Request, Response } from 'express';
import { Config } from '../classes/config';
import mongoose from 'mongoose';
import { CustomError } from '../services/errorHandler';

export const ConfigController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const option: string = req.query.option as string;
      if(!option) return next(new CustomError('Option não encontrado.', 404));
      await ConfigModel.updateMany({option}, {$set: {'status.deletedAt': new Date()}}).exec();
      const config: Config = new Config({_id: new mongoose.Types.ObjectId(), option, data: req.body});
      const created = (await ConfigModel.create(config)).toObject();
      return res.status(201).send(created);
    } catch (error: Error | unknown) {
      console.error('ERRO CRIANDO CONFIGURAÇÃO: ', error);
      return next(error);
    }
  },

  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const {option} = req.query;

      const config = (await ConfigModel.findOne({'status.deletedAt': null, option}).exec());
      if(!config) return next(new CustomError('Configuração não encontrado.', 404));

      return res.status(200).send(config.data);
    } catch (error) {
      console.error('ERRO BUSCANDO CONFIGURAÇÃO: ', error);
      return next(error);
    }
  }
};
