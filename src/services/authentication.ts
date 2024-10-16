'use strict';
import { Buffer } from 'buffer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import {UserModel} from '../models/user';
import { AuthUser, UserType } from '../commons/interfaces/user';
import UserService from '../implementations/user';
import { User } from '../classes/user';
import moment from 'moment';
import { CustomError } from './errorHandler';

//* Chave privada para geração de tokens
const privateKey = process.env.JWT_PRIVATE_KEY ? process.env.JWT_PRIVATE_KEY : 'SECRET_KEY';

//* Tempo para expiração da chave em horas
const EXP_TIME = 24;

//* Token de autenticação
interface IToken {
  exp: number;
  iat?: number;
  user: User;
  ip: string;
}

//* Usuário com token para retorno
export type AuthRequest = Request & { user?: User }

//* Decodifica base64
export const decodeBase = (str: string) => Buffer.from(str, 'base64').toString('binary');

class Authentication {
  static authentication: Authentication;
  static getInstance = function() {
    if (Authentication.authentication == undefined) {
      Authentication.authentication = new Authentication();
    }
    return Authentication.authentication;
  };

  //* Gera o token JWT
  generateJWT = function(user: User, ip: string) {
    const info = {
      user: user._id,
      email: user.email,
      exp: Date.now() + (EXP_TIME * 3600000),
      ip
    };
    return jwt.sign(info, privateKey);
  };

  //* Autenticação unificada
  async auth(receivedToken: string, ip: string): Promise<AuthUser> {
    const [ authentication, token ] = receivedToken.split(' ');
    let user: AuthUser;
    if(!token) throw 'Token não fornecido.';

    if(authentication == 'Basic') user = await this.basicAuth(token, ip);
    else if(authentication == 'Bearer') user = await this.bearerAuth(token, ip);
    else throw 'Tipo de autenticação não reconhecido.';

    //* Salva o usuário autenticado no request
    UserService.authUser = user;

    return user;
  }

  //* Autenticação Basic
  private async basicAuth(token: string, ip: string): Promise<AuthUser>{
    //* Decodifica o token e recebe o email e senha
    const [email, password] = token ? Buffer.from(token, 'base64').toString().split(':') : [null, null];
    let user: AuthUser;
    let insensitiveEmail = '';
    if(email) insensitiveEmail = email.toLowerCase();

    //* Busca o usuário no BD para autenticação
    const respUser: User | undefined = (await UserModel.findOne({ email: insensitiveEmail, 'status.deletedAt': null }).select('+password').exec())?.toObject();

    if(!respUser || !password)
      throw 'Usuário ou senha inválidos.';
    else user = {...respUser, token: this.generateJWT(respUser, ip)};

    if(!user.password) throw 'Usuário não possui senha.';

    //* Compara a senha do usuário com a senha fornecida
    if(await bcrypt.compare(password, user.password)) return user;
    else throw 'Senha incorreta.';
  }


  //* Autenticação Bearer
  private async bearerAuth (token: string, ip: string): Promise<AuthUser>{
    //* Verifica o token
    const payload = jwt.verify(token, privateKey) as IToken;

    //* Se a data não expirou e o ip não mudou
    if((payload.exp > Date.now()) && (payload.ip == ip)){
      payload.exp = moment().add(EXP_TIME, 'hours').valueOf();
      delete payload.iat;

      //* Busca o usuário no BD
      let user: AuthUser;
      const respUser: User | undefined = (await UserModel.findOne({ _id: payload.user, 'status.deletedAt': null}))?.toObject();

      if(!respUser) throw 'Usuário inválido.';
      else user = {...respUser, token: this.generateJWT(respUser, ip)};

      return user;
    } else {
      console.error('Token expirado ou IP inválido.');
      throw new CustomError('Token expirado ou IP inválido.', 401);
    }
  }

  public userMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if(!req.headers.authorization) throw 'Token de acesso não fornecido.';
      await this.auth(req.headers.authorization, req.ip || '');

      return next();
    } catch (error) {
      console.error('Falha na autenticação de usuário:', error);
      return next(new CustomError('Falha na autenticação de usuário: ' + error, 401));
    }
  };

  managerMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if(!req.headers.authorization) throw 'Token de acesso não fornecido.';
      await this.auth(req.headers.authorization, req.ip || '');

      if(!(UserService.authUser?.type === UserType.MANAGER || UserService.authUser?.type === UserType.ADMIN)) throw 'Usuário não é um gerente.';

      return next();
    } catch (error) {
      console.error('Erro na autenticação de gestor:', error);
      return next(new CustomError('Erro na autenticação de gestor: ' + error, 401));
    }
  };

  public adminMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if(!req.headers.authorization) throw 'Token de acesso não fornecido.';
      await this.auth(req.headers.authorization, req.ip || '');

      if(!(UserService.authUser?.type === UserType.ADMIN)) throw 'Usuário não é um administrador.';

      return next();
    } catch (error) {
      console.error('Erro na autenticação de administrador:', error);
      return next(new CustomError('Erro na autenticação de administrador: ' + error, 401));
    }
  };
}


export default Authentication.getInstance();