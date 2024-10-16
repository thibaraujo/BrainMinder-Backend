'use strict';
import { NextFunction, Request, Response } from 'express';
import { AuthRequest} from '../services/authentication';
import { CustomError } from '../services/errorHandler';
import UserService from '../implementations/user';

export const UserController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      return res.status(201).send(await UserService.create(req.body));
    } catch (error: Error | unknown) {
      console.error('ERRO CRIANDO USUÁRIO: ', error);
      return next(error);
    }
  },

  async createMe(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).send(await UserService.createMe(req.body));
    } catch (error) {
      console.error('ERRO CRIANDO USUÁRIO: ', error);
      return next(error);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).send(await UserService.get(req.query));
    } catch (error) {
      console.error('ERRO LISTANDO USUÁRIOS: ', error);
      return next(error);
    }
  },

  async read(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).send(await UserService.getById(req.query.id as string));
    } catch (error) {
      console.error('ERRO BUSCANDO USUÁRIO: ', error);
      return next(error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      return res.status(200).send(await UserService.update(req.query.id as string, req.body));
    } catch (error) {
      console.error('ERRO EDITANDO USUÁRIO: ', error);
      return next(error);
    }
  },

  async updateMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      return res.status(200).send(await UserService.updateMe(req.body));
    } catch (error) {
      console.error('ERRO EDITANDO USUÁRIO: ', error);
      return next(error);
    }
  },

  async patch(req: AuthRequest, res: Response, next: NextFunction){
    const userId = req.query.id;
    try {

      return res.status(200).send(await UserService.patch(userId as string, req.body));
    } catch (error) {
      console.error('ERRO ATUALIZANDO USUÁRIO: ', error);
      return next(error);
    }
  },

  async patchMe(req: AuthRequest, res: Response, next: NextFunction){
    try {
      return res.status(200).send(await UserService.patchMe(req.body));
    } catch (error) {
      console.error('ERRO ATUALIZANDO USUÁRIO: ', error);
      return next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      return res.status(200).send(await UserService.delete(req.query.id as string));
    } catch (error) {
      console.error('ERRO DESABILITANDO USUÁRIO: ', error);
      return next(error);
    }
  },

  async deleteMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      return res.status(200).send(await UserService.deleteMe());
    } catch (error) {
      console.error('ERRO DESABILITANDO USUÁRIO: ', error);
      return next(error);
    }
  },

  async activate(req: AuthRequest, res: Response, next: NextFunction) {
    const activate: boolean = req.query.activate === 'true';

    try {
      return res.status(200).send(await UserService.activate(req.query.id as string, activate));
    } catch (error) {
      console.error('ERRO ATIVANDO USUÁRIO: ', error);
      return next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try{
      return res.status(200).send(await UserService.login(req.headers.authorization as string, req.ip));
    } catch(error){
      console.error('ERRO INICIANDO SESSÃO DO USUÁRIO : ', error);
      next(new CustomError('Usuário ou senha inválidos.', 401));
    }
  },

  async passwordDefinitionRequest(req: Request, res: Response, next: NextFunction) {
    try{
      const {email} = req.query;
      if(email) return res.status(200).send(await UserService.passwordDefinitionRequest({email: email.toString()}));

    } catch(error){
      console.error('ERRO DEFININDO SENHA DO USUÁRIO : ', error);
      return next(error);
    }
  },

  async passwordDefinition(req: Request, res: Response, next: NextFunction) {
    try{
      const {token, password} = req.body;
      if(!token) return next(new CustomError('Token não informado.', 400));
      if(!password) return next(new CustomError('Senha não informado.', 400));
      return res.status(200).send(await UserService.passwordDefinition({token: token, password: password}));

    } catch(error){
      console.error('ERRO DEFININDO SENHA DO USUÁRIO : ', error);
      return next(error);
    }
  },

  async emailValidationRequest(req: Request, res: Response, next: NextFunction) {
    try{
      const {email} = req.query;
      if(email) return res.status(200).send(await UserService.emailValidationRequest({email: email.toString()}));

    } catch(error){
      console.error('ERRO DEFININDO SENHA DO USUÁRIO : ', error);
      return next(error);
    }
  },

  async emailValidation(req: Request, res: Response, next: NextFunction) {
    const {token} = req.body;
    if(!token) return next(new CustomError('Token não informado.', 400));

    try{
      return res.status(200).send(await UserService.emailValidation({token}));

    } catch(error){
      console.error('ERRO VALIDANDO EMAIL DO USUÁRIO : ', error);
      return next(new CustomError('Não foi validar o email.', 500));
    }
  },
};



