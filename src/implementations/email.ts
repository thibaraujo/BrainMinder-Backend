import { ICreateBody, ICreateResponse, IGetByIdResponse, IGetQuery, IGetResponse, IUpdateBody, IUpdateResponse, EmailServiceBase } from '../commons/requests/email';
import { Email } from '../classes/email';
import { EmailModel } from '../models/email';
import mongoose from 'mongoose';
import { CustomError } from '../services/errorHandler';
import dot from 'dot-object';


class EmailServiceClass extends EmailServiceBase {
  private static instance: EmailServiceClass;
  static getInstance(): EmailServiceClass {
    if (!EmailServiceClass.instance) EmailServiceClass.instance = new EmailServiceClass();
    return EmailServiceClass.instance;
  }

  authEmail?: Email;

  async get(query: IGetQuery): Promise<IGetResponse> {
    const { page = 1, pageSize = 10, search }: IGetQuery = query;

    const mongoQuery: mongoose.FilterQuery<Email> = {
      'status.deletedAt': null,
      'status.deactivatedAt': null
    };

    if (search) {
      mongoQuery.$or = [
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }
    const skip = (page - 1) * pageSize;
    const emails = await EmailModel.find(mongoQuery).skip(skip).limit(pageSize).sort({ _id: -1 }).exec();

    return { results: emails, total: await EmailModel.countDocuments(mongoQuery) };
  }

  async getById(id: string): Promise<IGetByIdResponse> {

    const email = (await EmailModel.findById(id).lean().exec());
    if (!email) throw new CustomError('Usuário não encontrado.', 404);

    return email;
  }

  async create(data: ICreateBody): Promise<ICreateResponse> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const email: Email = new Email({ ...data });

      const created = (await EmailModel.create([email], { session }))[0].toObject() as Email;

      await session.commitTransaction();

      return created;
    } catch (error: Error | unknown) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async update(id: string, data: IUpdateBody): Promise<IUpdateResponse> {
    const updated = (await EmailModel.findByIdAndUpdate(id, { $set: { ...data } }, { new: true }).exec());
    if (!updated) throw new CustomError('Usuário não encontrado.', 404);

    return updated;
  }

  async patch(id: string, data: IUpdateBody): Promise<IUpdateResponse> {
    const updated = (await EmailModel.findByIdAndUpdate(id, { $set: { ...dot.dot(data) } }, { upsert: true }).exec());
    if (!updated) throw new CustomError('Usuário não encontrado.', 404);

    return updated;
  }

  async delete(id: string): Promise<void> {
    const deleted = await EmailModel.findByIdAndUpdate(id, { $set: { 'status.deletedAt': new Date() } }, { new: true }).exec();
    if (!deleted) throw new CustomError('Usuário não encontrado.', 404);
  }

  async deleteMe(): Promise<void> {
    const deleted = await EmailModel.findByIdAndUpdate(this.authEmail, { $set: { 'status.deletedAt': new Date(), cpf: '00000000000', email: 'deletado@deletado.deletado', firstName: 'Usuário removido', lastName: '.' } }, { new: true }).exec();
    if (!deleted) throw new CustomError('Usuário não encontrado.', 404);
  }

  async activate(id: string, activate: boolean): Promise<IUpdateResponse> {
    let updated: Email | null;
    if (activate) updated = (await EmailModel.findByIdAndUpdate(id, { $set: { 'status.deactivatedAt': null } }, { new: true }).exec());
    else updated = (await EmailModel.findByIdAndUpdate(id, { $set: { 'status.deactivatedAt': new Date() } }, { new: true }).exec());

    if (!updated) throw new CustomError('Usuário não encontrado.', 404);

    return updated;
  }

}

const EmailService = EmailServiceClass.getInstance();
export default EmailService;


