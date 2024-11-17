'use strict';
import { NextFunction, Request, Response } from 'express';
import { AuthRequest } from '../services/authentication';
import SmsService from '../implementations/sms';

export const SmsController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      return res.status(201).send(await SmsService.create(req.body));
    } catch (error: Error | unknown) {
      console.error('ERRO CRIANDO USUÁRIO: ', error);
      return next(error);
    }
  },


  async list(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).send(await SmsService.get(req.query));
    } catch (error) {
      console.error('ERRO LISTANDO USUÁRIOS: ', error);
      return next(error);
    }
  },

  async read(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).send(await SmsService.getById(req.query.id as string));
    } catch (error) {
      console.error('ERRO BUSCANDO USUÁRIO: ', error);
      return next(error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      return res.status(200).send(await SmsService.update(req.query.id as string, req.body));
    } catch (error) {
      console.error('ERRO EDITANDO USUÁRIO: ', error);
      return next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      return res.status(200).send(await SmsService.delete(req.query.id as string));
    } catch (error) {
      console.error('ERRO DESABILITANDO USUÁRIO: ', error);
      return next(error);
    }
  },

  async activate(req: AuthRequest, res: Response, next: NextFunction) {
    const activate: boolean = req.query.activate === 'true';

    try {
      return res.status(200).send(await SmsService.activate(req.query.id as string, activate));
    } catch (error) {
      console.error('ERRO ATIVANDO USUÁRIO: ', error);
      return next(error);
    }
  },
};



