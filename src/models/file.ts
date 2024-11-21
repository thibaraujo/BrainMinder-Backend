import { Schema, model } from 'mongoose';
import database from '../services/database';
import { File } from '../classes/file';

const FileSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  extension: {
    type: String,
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
  url: {
    type: String,
  },
});

database.setupSchema(FileSchema);

export const FileModel = model<File>('File', FileSchema);

