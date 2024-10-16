import {
  IGetQuery as DefaultIGetQuery,
  IGetResponse as DefaultIGetResponse,
} from '../interfaces/base';
import { AuthUser, IUser, IUserRaw } from '../interfaces/user';

export type IGetQuery = DefaultIGetQuery & {
  company?: string
  active?: boolean
}
export type IGetResponse = DefaultIGetResponse<IUser>
export type IGetByIdResponse = IUser
export type ICreateBody = IUserRaw
export type ICreateResponse = IUser
export type IUpdateBody = Partial<IUser>
export type IUpdateResponse = IUser

export type IPasswordDefinitionRequestBody = {
  email: string
  creatingNewUser?: boolean
}
export type IPasswordDefinitionBody = {
  password: string
  token: string
}

export type IEmailValidationRequestBody = {
  email: string
}
export type IEmailValidationBody = {
  token: string
}

export abstract class UserServiceBase {
  //* GET   /users (Admin)
  abstract get(query: IGetQuery): Promise<IGetResponse>
  //* GET   /users?id={id} (Admin)
  abstract getById(id: string): Promise<IGetByIdResponse>

  //* POST  /users (Admin)
  abstract create(data: ICreateBody): Promise<ICreateResponse>
  //* POST  /users/me (User. Registro público, quando houver atualização)
  abstract createMe(data: Omit<ICreateBody, 'permissions' | 'type'>): Promise<ICreateResponse>

  //* PUT   /users?id={id} (Admin)
  abstract update(id: string, data: IUpdateBody): Promise<IUpdateResponse>
  //* PUT   /users/me (User)
  abstract updateMe(data: IUpdateBody): Promise<IUpdateResponse>
  //* PUT  /users/activate?id={id}&activate={true|false} (Admin)
  abstract activate(id: string, activate: boolean): Promise<IUpdateResponse>

  //* DEL   /users?id={id} (Admin)
  abstract delete(id: string): Promise<void>
  //* DEL   /users/me (User)
  abstract deleteMe(): Promise<void>

  //* POST  /users/login (User)
  abstract login(authorization: string, ip?: string): Promise<AuthUser>

  //* GET   /users/password-definition (User)
  abstract passwordDefinitionRequest({ email }: IPasswordDefinitionRequestBody): Promise<void>

  //* POST  /users/password-definition (User)
  abstract passwordDefinition({ password, token }: IPasswordDefinitionBody): Promise<void>

  //* GET   /users/email-validation (User)
  abstract emailValidationRequest({ email }: IEmailValidationRequestBody): Promise<void>

  //* POST  /users/email-validation (User)
  abstract emailValidation({ token }: IEmailValidationBody): Promise<void>
}
