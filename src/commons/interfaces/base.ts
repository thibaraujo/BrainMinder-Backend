import mongoose from 'mongoose';

export type IGetQuery = {
  page?: number
  pageSize?: number
  search?: string
}

export type IGetResponse<IRawData> = {
  results: IRawData[]
  total: number
}

export interface IStatus {
  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null
  deactivatedAt: Date | null
  emailValidatedAt?: Date
}

export interface IObjectRaw {
  _id?: mongoose.Types.ObjectId,
  status?: IStatus
}
