import { Schema, model } from 'mongoose';
import database from '../services/database';
import { Sms } from '../classes/sms';

const SmsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  blackList: {
    type: Boolean,
    required: true,
  },
  whatsapp: {
    type: Boolean,
    required: true,
  },
});

database.setupSchema(SmsSchema);

export const SmsModel = model<Sms>('Sms', SmsSchema);