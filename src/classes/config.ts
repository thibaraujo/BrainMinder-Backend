import { IConfig } from '../commons/interfaces/config';
import { ObjectRaw } from './commonFields';

export class Config extends ObjectRaw implements IConfig{
  option: string;
  data: object;

  constructor(config: IConfig) {
    super(config);
    this.option = config.option;
    this.data = config.data;
  }
}
