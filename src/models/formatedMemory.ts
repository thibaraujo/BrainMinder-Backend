import { Schema, model } from 'mongoose';
import database from '../services/database';
import { FormatedMemory } from '../classes/formatedMemory';

const FormatedMemorySchema = new Schema({
  keyWords: {
    type: [String],
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  sumary: {
    type: String,
    required: false,
  },
  context: {
    type: String,
    required: false,
  },
  text: {
    type: String,
    required: true,
  },
  embeddings: {
    type: [String],
    required: false,
    default: [],
  },
});

database.setupSchema(FormatedMemorySchema);

export const FormatedMemoryModel = model<FormatedMemory>('FormatedMemory', FormatedMemorySchema);
