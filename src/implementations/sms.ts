import { ICreateBody, ICreateResponse, IGetByIdResponse, IGetQuery, IGetResponse, IUpdateBody, IUpdateResponse, SmsServiceBase } from '../commons/requests/sms';
import { Sms } from '../classes/sms';
import { SmsModel } from '../models/sms';
import mongoose from 'mongoose';
import { CustomError } from '../services/errorHandler';
import dot from 'dot-object';


class SmsServiceClass extends SmsServiceBase {
  private static instance: SmsServiceClass;
  static getInstance(): SmsServiceClass {
    if (!SmsServiceClass.instance) SmsServiceClass.instance = new SmsServiceClass();
    return SmsServiceClass.instance;
  }

  authSms?: Sms;

  async get(query: IGetQuery): Promise<IGetResponse> {
    const { page = 1, pageSize = 10, search, company }: IGetQuery = query;

    const mongoQuery: mongoose.FilterQuery<Sms> = {
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
    const smss = await SmsModel.find(mongoQuery).skip(skip).limit(pageSize).sort({ _id: -1 }).exec();

    return { results: smss, total: await SmsModel.countDocuments(mongoQuery) };
  }

  async getById(id: string): Promise<IGetByIdResponse> {

    const sms = (await SmsModel.findById(id).lean().exec());
    if (!sms) throw new CustomError('Usuário não encontrado.', 404);

    return sms;
  }

  async create(data: ICreateBody): Promise<ICreateResponse> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const sms: Sms = new Sms({ ...data });

      const created = (await SmsModel.create([sms], { session }))[0].toObject() as Sms;

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
    const updated = (await SmsModel.findByIdAndUpdate(id, { $set: { ...data } }, { new: true }).exec());
    if (!updated) throw new CustomError('Usuário não encontrado.', 404);

    return updated;
  }

  async patch(id: string, data: IUpdateBody): Promise<IUpdateResponse> {
    const updated = (await SmsModel.findByIdAndUpdate(id, { $set: { ...dot.dot(data) } }, { upsert: true }).exec());
    if (!updated) throw new CustomError('Usuário não encontrado.', 404);

    return updated;
  }

  async delete(id: string): Promise<void> {
    const deleted = await SmsModel.findByIdAndUpdate(id, { $set: { 'status.deletedAt': new Date() } }, { new: true }).exec();
    if (!deleted) throw new CustomError('Usuário não encontrado.', 404);
  }

  async deleteMe(): Promise<void> {
    const deleted = await SmsModel.findByIdAndUpdate(this.authSms, { $set: { 'status.deletedAt': new Date(), cpf: '00000000000', email: 'deletado@deletado.deletado', firstName: 'Usuário removido', lastName: '.' } }, { new: true }).exec();
    if (!deleted) throw new CustomError('Usuário não encontrado.', 404);
  }

  async activate(id: string, activate: boolean): Promise<IUpdateResponse> {
    let updated: Sms | null;
    if (activate) updated = (await SmsModel.findByIdAndUpdate(id, { $set: { 'status.deactivatedAt': null } }, { new: true }).exec());
    else updated = (await SmsModel.findByIdAndUpdate(id, { $set: { 'status.deactivatedAt': new Date() } }, { new: true }).exec());

    if (!updated) throw new CustomError('Usuário não encontrado.', 404);

    return updated;
  }

}

const SmsService = SmsServiceClass.getInstance();
export default SmsService;


