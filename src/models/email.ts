import { Schema, model } from 'mongoose';
import database from '../services/database';
import { Email } from '../classes/email';

const EmailSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  blackList: {
    type: Boolean,
    required: true,
  },
});

database.setupSchema(EmailSchema);

export const EmailModel = model<Email>('Email', EmailSchema);
