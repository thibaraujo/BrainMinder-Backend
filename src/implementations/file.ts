import { ICreateBody, ICreateResponse, IGetByIdResponse, IGetQuery, IGetResponse, IUpdateBody, IUpdateResponse, FileServiceBase } from '../commons/requests/file';
import { File } from '../classes/file';
import { FileModel } from '../models/file';
import mongoose from 'mongoose';
import { CustomError } from '../services/errorHandler';
import dot from 'dot-object';


class FileServiceClass extends FileServiceBase {
  private static instance: FileServiceClass;
  static getInstance(): FileServiceClass {
    if (!FileServiceClass.instance) FileServiceClass.instance = new FileServiceClass();
    return FileServiceClass.instance;
  }

  authFile?: File;

  async get(query: IGetQuery): Promise<IGetResponse> {
    const { page = 1, pageSize = 10, search }: IGetQuery = query;

    const mongoQuery: mongoose.FilterQuery<File> = {
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
    const files = await FileModel.find(mongoQuery).skip(skip).limit(pageSize).sort({ _id: -1 }).exec();

    return { results: files, total: await FileModel.countDocuments(mongoQuery) };
  }

  async getById(id: string): Promise<IGetByIdResponse> {

    const file = (await FileModel.findById(id).lean().exec());
    if (!file) throw new CustomError('Usuário não encontrado.', 404);

    return file;
  }

  async create(data: ICreateBody): Promise<ICreateResponse> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const file: File = new File({ ...data });

      const created = (await FileModel.create([file], { session }))[0].toObject() as File;

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
    const updated = (await FileModel.findByIdAndUpdate(id, { $set: { ...data } }, { new: true }).exec());
    if (!updated) throw new CustomError('Usuário não encontrado.', 404);

    return updated;
  }

  async patch(id: string, data: IUpdateBody): Promise<IUpdateResponse> {
    const updated = (await FileModel.findByIdAndUpdate(id, { $set: { ...dot.dot(data) } }, { upsert: true }).exec());
    if (!updated) throw new CustomError('Usuário não encontrado.', 404);

    return updated;
  }

  async delete(id: string): Promise<void> {
    const deleted = await FileModel.findByIdAndUpdate(id, { $set: { 'status.deletedAt': new Date() } }, { new: true }).exec();
    if (!deleted) throw new CustomError('Usuário não encontrado.', 404);
  }

  async deleteMe(): Promise<void> {
    const deleted = await FileModel.findByIdAndUpdate(this.authFile, { $set: { 'status.deletedAt': new Date(), cpf: '00000000000', email: 'deletado@deletado.deletado', firstName: 'Usuário removido', lastName: '.' } }, { new: true }).exec();
    if (!deleted) throw new CustomError('Usuário não encontrado.', 404);
  }

  async activate(id: string, activate: boolean): Promise<IUpdateResponse> {
    let updated: File | null;
    if (activate) updated = (await FileModel.findByIdAndUpdate(id, { $set: { 'status.deactivatedAt': null } }, { new: true }).exec());
    else updated = (await FileModel.findByIdAndUpdate(id, { $set: { 'status.deactivatedAt': new Date() } }, { new: true }).exec());

    if (!updated) throw new CustomError('Usuário não encontrado.', 404);

    return updated;
  }

}

const FileService = FileServiceClass.getInstance();
export default FileService;


