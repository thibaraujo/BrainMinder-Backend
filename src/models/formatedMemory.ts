import { Schema, model } from 'mongoose';
import database from '../services/database';
import { FormatedMemory } from '../classes/formatedMemory';

const FormatedMemorySchema = new Schema({
  keyWords: {
    type: [String],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  sumary: {
    type: String,
    required: true,
  },
  context: {
    type: String,
    required: true,
  },
});

database.setupSchema(FormatedMemorySchema);

export const FormatedMemoryModel = model<FormatedMemory>('FormatedMemory', FormatedMemorySchema);
