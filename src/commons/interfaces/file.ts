import { IObjectRaw } from "./base";

export type IFileRaw = {
  name: string;
  extension: string;
  length: number;
  url?: string;
}

export type IFile = IFileRaw & IObjectRaw