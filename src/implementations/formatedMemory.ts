import { ICreateBody, ICreateResponse, IGetByIdResponse, IGetQuery, IGetResponse, IUpdateBody, IUpdateResponse, FormatedMemoryServiceBase } from '../commons/requests/formatedMemory';
import { FormatedMemory } from '../classes/formatedMemory';
import { FormatedMemoryModel } from '../models/formatedMemory';
import mongoose from 'mongoose';
import { CustomError } from '../services/errorHandler';
import dot from 'dot-object';


class FormatedMemoryServiceClass extends FormatedMemoryServiceBase {
  private static instance: FormatedMemoryServiceClass;
  static getInstance(): FormatedMemoryServiceClass {
    if (!FormatedMemoryServiceClass.instance) FormatedMemoryServiceClass.instance = new FormatedMemoryServiceClass();
    return FormatedMemoryServiceClass.instance;
  }

  authFormatedMemory?: FormatedMemory;

  async get(query: IGetQuery): Promise<IGetResponse> {
    const { page = 1, pageSize = 10, search, company }: IGetQuery = query;

    const mongoQuery: mongoose.FilterQuery<FormatedMemory> = {
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
    const formatedMemorys = await FormatedMemoryModel.find(mongoQuery).skip(skip).limit(pageSize).sort({ _id: -1 }).exec();

    return { results: formatedMemorys, total: await FormatedMemoryModel.countDocuments(mongoQuery) };
  }

  async getById(id: string): Promise<IGetByIdResponse> {

    const formatedMemory = (await FormatedMemoryModel.findById(id).lean().exec());
    if (!formatedMemory) throw new CustomError('Usuário não encontrado.', 404);

    return formatedMemory;
  }

  async create(data: ICreateBody): Promise<ICreateResponse> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const formatedMemory: FormatedMemory = new FormatedMemory({ ...data });

      const created = (await FormatedMemoryModel.create([formatedMemory], { session }))[0].toObject() as FormatedMemory;

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
    const updated = (await FormatedMemoryModel.findByIdAndUpdate(id, { $set: { ...data } }, { new: true }).exec());
    if (!updated) throw new CustomError('Usuário não encontrado.', 404);

    return updated;
  }

  async patch(id: string, data: IUpdateBody): Promise<IUpdateResponse> {
    const updated = (await FormatedMemoryModel.findByIdAndUpdate(id, { $set: { ...dot.dot(data) } }, { upsert: true }).exec());
    if (!updated) throw new CustomError('Usuário não encontrado.', 404);

    return updated;
  }

  async delete(id: string): Promise<void> {
    const deleted = await FormatedMemoryModel.findByIdAndUpdate(id, { $set: { 'status.deletedAt': new Date() } }, { new: true }).exec();
    if (!deleted) throw new CustomError('Usuário não encontrado.', 404);
  }

  async deleteMe(): Promise<void> {
    const deleted = await FormatedMemoryModel.findByIdAndUpdate(this.authFormatedMemory, { $set: { 'status.deletedAt': new Date(), cpf: '00000000000', email: 'deletado@deletado.deletado', firstName: 'Usuário removido', lastName: '.' } }, { new: true }).exec();
    if (!deleted) throw new CustomError('Usuário não encontrado.', 404);
  }

  async activate(id: string, activate: boolean): Promise<IUpdateResponse> {
    let updated: FormatedMemory | null;
    if (activate) updated = (await FormatedMemoryModel.findByIdAndUpdate(id, { $set: { 'status.deactivatedAt': null } }, { new: true }).exec());
    else updated = (await FormatedMemoryModel.findByIdAndUpdate(id, { $set: { 'status.deactivatedAt': new Date() } }, { new: true }).exec());

    if (!updated) throw new CustomError('Usuário não encontrado.', 404);

    return updated;
  }

}

const FormatedMemoryService = FormatedMemoryServiceClass.getInstance();
export default FormatedMemoryService;


