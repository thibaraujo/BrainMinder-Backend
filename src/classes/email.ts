import mongoose from 'mongoose';
import { ObjectRaw } from './commonFields';
import { IUser } from '../commons/interfaces/user';
import { IEmail } from '../commons/interfaces/email';
import { User } from './user';

export class Email extends ObjectRaw implements IEmail {
  user: mongoose.Types.ObjectId | IUser | User;
  blackList: boolean;

  constructor(email: IEmail) {
    super(email); // Passa o objeto para a classe base
    this.user = email.user;
    this.blackList = email.blackList;
  }
}