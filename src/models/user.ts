import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';
import { User } from '../classes/user';
import dot from 'dot-object';
import { UserType } from '../commons/interfaces/user';
import database from '../services/database';
import bcrypt from 'bcryptjs';
import { ClientEncryption, MongoClient } from "mongodb";

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
    select: false,
  },
  type: {
    type: String,
    required: true,
    enum: UserType,
  },
  permissions: {
    type: Object,
    required: false,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: false,
  },
  cpf: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    unique: true,
  }
});

database.setupSchema(UserSchema);

UserSchema.index({ email: 'text' });

UserSchema.virtual('fullName').get((u: User) => {
  return (u.firstName.trim() + ' ' + u.lastName.trim());
});

UserSchema.pre(['updateOne', 'findOneAndUpdate'], async function (next) {
  this.setOptions({ new: true, runValidators: true });
  const changes = this.getUpdate();
  const dottedChanges = dot.dot(changes);
  if (!changes) return next();
  if (dottedChanges['$set.email']) this.set('status.emailValidatedAt', null);
  return next();
});

UserSchema.pre('save', async function (next) {
  if (this.password) this.password = await bcrypt.hash(this.password, 10);
  return next();
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("cpf")) return next();
  const path = "./customer-master-key.txt";
  const fs = require("fs");
  const localMasterKey = fs.readFileSync(path);
  const kmsProviders = {
    local: {
      key: localMasterKey,
    },
  };

  const user = process.env.DATABASE_USER;
  const password = process.env.DATABASE_PASSWORD;
  const databaseName = process.env.DATABASE_NAME;
  const host = process.env.DATABASE_HOST;

  const uri = `mongodb+srv://${user}:${password}@${host}/${databaseName}?retryWrites=true&w=majority`;
  const keyVaultDatabaseName = "encryption";
  const keyVaultCollectionName = "__keyVault";
  const keyVaultNamespace = `${keyVaultDatabaseName}.${keyVaultCollectionName}`;

  try {
    const client = new MongoClient(uri);
    const encryption = new ClientEncryption(client, {
      keyVaultNamespace,
      kmsProviders
    });
    const keyId = await encryption.createDataKey("local");
    console.log("DataKey criado com ID:", keyId.toString("base64"));

    this.cpf = await encryption.encrypt(this.cpf, {
      algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
      // AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic
      keyId: keyId
    });

    console.log("Campo criptografado:", this.cpf);
    const decryptedField = await encryption.decrypt(this.cpf);
    console.log("Campo descriptografado:", decryptedField);
    next();
  } catch (err) {
    console.error(err);
  }
});

export const UserModel = model<User>('User', UserSchema);