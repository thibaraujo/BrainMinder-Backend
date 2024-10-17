import { IDocument } from '../commons/interfaces/document';
import { ObjectRaw } from './commonFields';

export class Document extends ObjectRaw implements IDocument {
  name: string;
  extension: string;
  length: number;

  constructor(document: IDocument) {
    super(document);
    this.name = document.name;
    this.extension = document.extension;
    this.length = document.length;
  }
}