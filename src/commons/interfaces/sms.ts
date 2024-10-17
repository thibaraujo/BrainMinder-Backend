import mongoose from "mongoose";
import { IUser } from "./user";
import { IObjectRaw } from "./base";
import { User } from "../../classes/user";

export type ISmsRaw = {
  user: mongoose.Types.ObjectId | IUser | User;
  blackList: boolean;
  whatsapp: boolean;
}

export type ISms = ISmsRaw & IObjectRaw