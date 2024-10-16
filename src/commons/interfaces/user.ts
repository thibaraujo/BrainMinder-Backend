import mongoose from 'mongoose';
import { IObjectRaw } from './base';

export enum UserType {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
}

export type IUserRaw = {
  firstName: string
  lastName: string
  cpf: string
  type: UserType
  email: string
  password?: string
}

export type IUser = IUserRaw & IObjectRaw

export type AuthUser = IUser & { token: string }
