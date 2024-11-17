import {
  IGetQuery as DefaultIGetQuery,
  IGetResponse as DefaultIGetResponse,
} from '../interfaces/base';
import { ISms, ISmsRaw } from '../interfaces/sms';

export type IGetQuery = DefaultIGetQuery & {
  company?: string
  active?: boolean
}
export type IGetResponse = DefaultIGetResponse<ISms>
export type IGetByIdResponse = ISms
export type ICreateBody = ISmsRaw
export type ICreateResponse = ISms
export type IUpdateBody = Partial<ISms>
export type IUpdateResponse = ISms


export abstract class SmsServiceBase {
  //* GET   /smss 
  abstract get(query: IGetQuery): Promise<IGetResponse>
  //* GET   /smss?id={id}
  abstract getById(id: string): Promise<IGetByIdResponse>

  //* POST  /smss
  abstract create(data: ICreateBody): Promise<ICreateResponse>

  //* PUT   /smss?id={id}
  abstract update(id: string, data: IUpdateBody): Promise<IUpdateResponse>
  //* PUT  /smss/activate?id={id}&activate={true|false}
  abstract activate(id: string, activate: boolean): Promise<IUpdateResponse>

  //* DEL   /smss?id={id} 
  abstract delete(id: string): Promise<void>
}
