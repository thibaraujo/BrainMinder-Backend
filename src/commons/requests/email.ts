import {
  IGetQuery as DefaultIGetQuery,
  IGetResponse as DefaultIGetResponse,
} from '../interfaces/base';
import { IEmail, IEmailRaw } from '../interfaces/email';

export type IGetQuery = DefaultIGetQuery & {
  active?: boolean
}
export type IGetResponse = DefaultIGetResponse<IEmail>
export type IGetByIdResponse = IEmail
export type ICreateBody = IEmailRaw
export type ICreateResponse = IEmail
export type IUpdateBody = Partial<IEmail>
export type IUpdateResponse = IEmail


export abstract class EmailServiceBase {
  //* GET   /emails 
  abstract get(query: IGetQuery): Promise<IGetResponse>
  //* GET   /emails?id={id}
  abstract getById(id: string): Promise<IGetByIdResponse>

  //* POST  /emails
  abstract create(data: ICreateBody): Promise<ICreateResponse>

  //* PUT   /emails?id={id}
  abstract update(id: string, data: IUpdateBody): Promise<IUpdateResponse>
  //* PUT  /emails/activate?id={id}&activate={true|false}
  abstract activate(id: string, activate: boolean): Promise<IUpdateResponse>

  //* DEL   /emails?id={id} 
  abstract delete(id: string): Promise<void>
}
