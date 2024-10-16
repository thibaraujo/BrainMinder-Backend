import mongoose from 'mongoose';
import { Schema } from 'mongoose';

export function commonFieldsPLugin(schema: Schema) {
  schema.add({
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    status: {
      type: Object,
      default: () => {
        return {
          createdAt: new Date(),
          updatedAt: null,
          deletedAt: null,
          deactivatedAt: null,
          emailValidatedAt: null,
          createdBy: null,
          updatedBy: null,
          deletedBy: null,
          deactivatedBy: null,
        };
      },
      required: true,
    },
  }
  );
}
