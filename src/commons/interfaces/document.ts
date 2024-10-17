import { IObjectRaw } from "./base";

export type IDocumentRaw = {
  name: string;
  extension: string;
  length: number;
}

export type IDocument = IDocumentRaw & IObjectRaw