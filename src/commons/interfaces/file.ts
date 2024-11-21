import { IObjectRaw } from "./base";

export type IFileRaw = {
  name: string;
  extension: string;
  length: number;
}

export type IFile = IFileRaw & IObjectRaw