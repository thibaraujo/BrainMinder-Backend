import mongoose from "mongoose";
import { IUser } from "./user";
import { IObjectRaw } from "./base";
import { User } from "../../classes/user";

export type IEmailRaw = {
  user: mongoose.Types.ObjectId | IUser | User;
  blackList: boolean;
}

export type IEmail = IEmailRaw & IObjectRaw