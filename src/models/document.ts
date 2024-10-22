import { Schema, model } from 'mongoose';
import database from '../services/database';
import { Document } from 'mongodb';

const DocumentSchema = new Schema({
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
});

database.setupSchema(DocumentSchema);

export const DocumentModel = model<Document>('Document', DocumentSchema);

