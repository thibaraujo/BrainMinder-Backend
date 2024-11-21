import {
  IGetQuery as DefaultIGetQuery,
  IGetResponse as DefaultIGetResponse,
} from '../interfaces/base';
import { IFile, IFileRaw } from '../interfaces/file';

export type IGetQuery = DefaultIGetQuery & {
  company?: string
  active?: boolean
}
export type IGetResponse = DefaultIGetResponse<IFile>
export type IGetByIdResponse = IFile
export type ICreateBody = IFileRaw
export type ICreateResponse = IFile
export type IUpdateBody = Partial<IFile>
export type IUpdateResponse = IFile


export abstract class FileServiceBase {
  //* GET   /files 
  abstract get(query: IGetQuery): Promise<IGetResponse>
  //* GET   /files?id={id}
  abstract getById(id: string): Promise<IGetByIdResponse>

  //* POST  /files
  abstract create(data: ICreateBody): Promise<ICreateResponse>

  //* PUT   /files?id={id}
  abstract update(id: string, data: IUpdateBody): Promise<IUpdateResponse>
  //* PUT  /files/activate?id={id}&activate={true|false}
  abstract activate(id: string, activate: boolean): Promise<IUpdateResponse>

  //* DEL   /files?id={id} 
  abstract delete(id: string): Promise<void>
}
