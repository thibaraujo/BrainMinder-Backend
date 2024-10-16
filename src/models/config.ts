import { Schema, model } from 'mongoose';
import {Config} from '../classes/config';

// SCHEMA

const ConfigSchema = new Schema({
  option: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
});

export const ConfigModel = model<Config>('Config', ConfigSchema);
