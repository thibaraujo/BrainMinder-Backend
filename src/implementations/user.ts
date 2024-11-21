import { ICreateBody, ICreateResponse, IEmailValidationBody, IEmailValidationRequestBody, IGetByIdResponse, IGetQuery, IGetResponse, IPasswordDefinitionBody, IPasswordDefinitionRequestBody, IUpdateBody, IUpdateResponse, UserServiceBase } from '../commons/requests/user';
import { User } from '../classes/user';
import { UserModel } from '../models/user';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import EmailService from '../services/email';
import { CustomError } from '../services/errorHandler';
import { AuthUser, UserType } from '../commons/interfaces/user';
import authentication from '../services/authentication';
import jwt from 'jsonwebtoken';
import dot from 'dot-object';

function setInsensitiveCase(key: string): string {
  const insensitiveCaseEmail = key.toLowerCase();
  key = insensitiveCaseEmail;
  return key;
}

class UserServiceClass extends UserServiceBase {
  private static instance: UserServiceClass;
  static getInstance(): UserServiceClass {
    if (!UserServiceClass.instance) UserServiceClass.instance = new UserServiceClass();
    return UserServiceClass.instance;
  }

  authUser?: User;

  async get(query: IGetQuery): Promise<IGetResponse> {
    const { page = 1, pageSize = 10, search, company }: IGetQuery = query;

    const mongoQuery: mongoose.FilterQuery<User> = {
      'status.deletedAt': null,
      'status.deactivatedAt': null
    };
    if (company) mongoQuery.company = company;

    if (search) {
      mongoQuery.$or = [
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }
    const skip = (page - 1) * pageSize;
    const users = await UserModel.find(mongoQuery).populate('company').skip(skip).limit(pageSize).sort({ _id: -1 }).exec();

    return { results: users, total: await UserModel.countDocuments(mongoQuery) };
  }

  async getById(id: string): Promise<IGetByIdResponse> {

    const user = (await UserModel.findById(id).populate('company').lean().exec());
    if (!user) throw new CustomError('Usuário não encontrado.', 404);

    return user;
  }

  async create(data: ICreateBody): Promise<ICreateResponse> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const user: User = new User({ ...data });

      const created = (await UserModel.create([user], { session }))[0].toObject() as User;
      created.password = undefined;

      await session.commitTransaction();

      return created;
    } catch (error: Error | unknown) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async createMe(data: Omit<ICreateBody, 'permissions' | 'type'>): Promise<ICreateResponse> {
    const user = new User({ ...data, email: setInsensitiveCase(data.email), type: UserType.USER });
    const created = (await UserModel.create(user)).populate('company');

    return created;
  }

  async update(id: string, data: IUpdateBody): Promise<IUpdateResponse> {
    const updated = (await UserModel.findByIdAndUpdate(id, { $set: { ...data } }, { new: true }).exec());
    if (!updated) throw new CustomError('Usuário não encontrado.', 404);

    return updated;
  }

  async updateMe(data: IUpdateBody): Promise<IUpdateResponse> {
    if (data.password) data.password = await bcrypt.hash(data.password, 10);
    const updated = (await UserModel.findByIdAndUpdate(this.authUser, { $set: { ...data } }, { new: true }).exec());
    if (!updated) throw new CustomError('Usuário não encontrado.', 404);

    return updated;
  }

  async patch(id: string, data: IUpdateBody): Promise<IUpdateResponse> {
    const updated = (await UserModel.findByIdAndUpdate(id, { $set: { ...dot.dot(data) } }, { upsert: true }).exec());
    if (!updated) throw new CustomError('Usuário não encontrado.', 404);

    return updated;
  }

  async patchMe(data: IUpdateBody): Promise<IUpdateResponse> {
    if (data.password) data.password = await bcrypt.hash(data.password, 10);
    const updated = (await UserModel.findByIdAndUpdate(this.authUser, { $set: { ...dot.dot(data) } }, { upsert: true }).exec());
    if (!updated) throw new CustomError('Usuário não encontrado.', 404);

    return updated;
  }

  async delete(id: string): Promise<void> {
    const deleted = await UserModel.findByIdAndUpdate(id, { $set: { 'status.deletedAt': new Date() } }, { new: true }).exec();
    if (!deleted) throw new CustomError('Usuário não encontrado.', 404);
  }

  async deleteMe(): Promise<void> {
    const deleted = await UserModel.findByIdAndUpdate(this.authUser, { $set: { 'status.deletedAt': new Date(), cpf: '00000000000', email: 'deletado@deletado.deletado', firstName: 'Usuário removido', lastName: '.' } }, { new: true }).exec();
    if (!deleted) throw new CustomError('Usuário não encontrado.', 404);
  }

  async activate(id: string, activate: boolean): Promise<IUpdateResponse> {
    let updated: User | null;
    if (activate) updated = (await UserModel.findByIdAndUpdate(id, { $set: { 'status.deactivatedAt': null } }, { new: true }).exec());
    else updated = (await UserModel.findByIdAndUpdate(id, { $set: { 'status.deactivatedAt': new Date() } }, { new: true }).exec());

    if (!updated) throw new CustomError('Usuário não encontrado.', 404);

    return updated;
  }

  async login(authorization: string, ip?: string): Promise<AuthUser> {
    if (!ip) throw new CustomError('IP não encontrado', 400);
    const user = await authentication.auth(authorization, ip) as AuthUser;
    user.password = undefined;
    return user;
  }

  async passwordDefinitionRequest({ email }: IPasswordDefinitionRequestBody): Promise<void> {
    const query: mongoose.FilterQuery<User> = {
      'status.deletedAt': null,
      email: setInsensitiveCase(email)
    };

    const user = await UserModel.findOne(query);
    if (!user) throw new CustomError('Usuário não encontrado.', 404);

    const decodedEmail = decodeURI(user.email);

    await EmailService.sendPasswordDefinitionEmail(decodedEmail);
  }

  async passwordDefinition({ password, token }: IPasswordDefinitionBody): Promise<void> {
    const { email } = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { email: string };
    const user = await UserModel.findOneAndUpdate({ 'status.deletedAt': null, email: email }, { password: await bcrypt.hash(password, 10) }, { new: true }).exec();
    if (!user?.password) user?.updateOne({ 'status.emailValidatedAt': new Date() }, { new: true }).exec();

    if (!user) throw new CustomError('Usuário não encontrado.', 404);
  }

  async emailValidationRequest({ email }: IEmailValidationRequestBody): Promise<void> {
    const query: mongoose.FilterQuery<User> = {
      'status.deletedAt': null
    };

    query.email = email;

    const user = await UserModel.findOne(query);
    if (!user) throw new CustomError('Usuário não encontrado.', 404);

    const decodedEmail = decodeURI(user.email);

    await EmailService.sendAccountValidationEmail(decodedEmail);
  }

  async emailValidation({ token }: IEmailValidationBody): Promise<void> {
    const { email } = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { email: string };
    const user = await UserModel.findOneAndUpdate({ email: email, 'status.deletedAt': null }, { 'status.emailValidatedAt': new Date() }, { new: true }).exec();

    if (!user) throw new CustomError('Usuário não encontrado.', 404);
  }

}

const UserService = UserServiceClass.getInstance();
export default UserService;


