import { IObjectRaw, IStatus } from '../commons/interfaces/base';
import mongoose from 'mongoose';

export class ObjectRaw implements IObjectRaw{
  _id?: mongoose.Types.ObjectId;
  status?: IStatus;

  constructor(commonFields: IObjectRaw) {
    this._id = commonFields._id;
    this.status = commonFields.status;
  }
}

// export interface ICommonFields{
//   _id: mongoose.Types.ObjectId;
//   status: IStatus;
//   createStatus(createdBy: IUser): void;
//   updateStatus(updatedBy: IUser): void;
//   deleteStatus(deletedBy: IUser): void;
//   activateStatus(deactivatedBy: IUser): void;
// }
