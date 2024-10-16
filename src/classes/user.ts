import { IUser, UserType } from '../commons/interfaces/user';
import { ObjectRaw } from './commonFields';

export class User extends ObjectRaw implements IUser {
  firstName: string;
  lastName: string;
  cpf: string;
  type: UserType;
  email: string;
  password?: string;

  constructor(user: IUser) {
    super(user);
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.cpf = user.cpf;
    this.type = user.type;
    this.password = user.password;
  }
}