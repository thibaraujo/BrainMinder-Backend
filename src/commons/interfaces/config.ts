import { IObjectRaw } from './base';

export interface IConfigRaw {
  option: string;
  data: object;
}

export type IConfig = IObjectRaw & IConfigRaw