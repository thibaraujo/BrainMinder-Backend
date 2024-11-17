import { IObjectRaw } from "./base";

export type IFormatedMemoryRaw = {
  keyWords: string[];
  title: string;
  sumary: string;
  context: string;
  text: string;
}

export type IFormatedMemory = IFormatedMemoryRaw & IObjectRaw