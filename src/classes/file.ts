
import { IFile } from '../commons/interfaces/file';
import { ObjectRaw } from './commonFields';

export class File extends ObjectRaw implements IFile {
  name: string;
  extension: string;
  length: number;
  url?: string;

  constructor(file: IFile) {
    super(file);
    this.name = file.name;
    this.extension = file.extension;
    this.length = file.length;
    this.url = file.url;
  }
}