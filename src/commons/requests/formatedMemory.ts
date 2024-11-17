import {
  IGetQuery as DefaultIGetQuery,
  IGetResponse as DefaultIGetResponse,
} from '../interfaces/base';
import { IFormatedMemory, IFormatedMemoryRaw } from '../interfaces/formatedMemory';

export type IGetQuery = DefaultIGetQuery & {
  company?: string
  active?: boolean
}
export type IGetResponse = DefaultIGetResponse<IFormatedMemory>
export type IGetByIdResponse = IFormatedMemory
export type ICreateBody = IFormatedMemoryRaw
export type ICreateResponse = IFormatedMemory
export type IUpdateBody = Partial<IFormatedMemory>
export type IUpdateResponse = IFormatedMemory


export abstract class FormatedMemoryServiceBase {
  //* GET   /formatedMemorys 
  abstract get(query: IGetQuery): Promise<IGetResponse>
  //* GET   /formatedMemorys?id={id}
  abstract getById(id: string): Promise<IGetByIdResponse>

  //* POST  /formatedMemorys
  abstract create(data: ICreateBody): Promise<ICreateResponse>

  //* PUT   /formatedMemorys?id={id}
  abstract update(id: string, data: IUpdateBody): Promise<IUpdateResponse>
  //* PUT  /formatedMemorys/activate?id={id}&activate={true|false}
  abstract activate(id: string, activate: boolean): Promise<IUpdateResponse>

  //* DEL   /formatedMemorys?id={id} 
  abstract delete(id: string): Promise<void>
}
