import { IFormatedMemory } from '../commons/interfaces/formatedMemory';
import { ObjectRaw } from './commonFields';

export class FormatedMemory extends ObjectRaw implements IFormatedMemory {
  keyWords: string[];
  title: string;
  sumary: string;
  context: string;

  constructor(formatedMemory: IFormatedMemory) {
    super(formatedMemory);
    this.keyWords = formatedMemory.keyWords;
    this.title = formatedMemory.title;
    this.sumary = formatedMemory.sumary;
    this.context = formatedMemory.context;
  }
}