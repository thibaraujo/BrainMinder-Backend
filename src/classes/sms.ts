import mongoose from 'mongoose';
import { ObjectRaw } from './commonFields';
import { IUser } from '../commons/interfaces/user';
import { ISms } from '../commons/interfaces/sms';
import { User } from './user';

export class Sms extends ObjectRaw implements ISms {
  user: mongoose.Types.ObjectId | IUser | User;
  blackList: boolean;
  whatsapp: boolean;

  constructor(sms: ISms) {
    super(sms); // Passa o objeto para a classe base
    this.user = sms.user;
    this.blackList = sms.blackList;
    this.whatsapp = sms.whatsapp;
  }
}