import mongoose from "mongoose";
import { IUser } from "./user";
import { IObjectRaw } from "./base";
import { User } from "../../classes/user";

export type IDocumentRaw = {
  name: string;
  extension: string;
  length: number;
}

export type IDocument = IDocumentRaw & IObjectRaw