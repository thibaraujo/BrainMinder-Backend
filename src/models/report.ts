import { Schema, model } from 'mongoose';
import database from '../services/database';
import { Report } from '../classes/report';

const ReportSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  context: {
    type: String,
    required: true,
  },
  sumary: {
    type: String,
    required: true,
  },
  memoryQuantity: {
    type: Number,
    required: true,
  },
  keyWords: {
    type: [String],
    required: true,
  },
});

database.setupSchema(ReportSchema);

export const ReportModel = model<Report>('Report', ReportSchema);