import { ReportTypes } from "../enums/report";
import { IObjectRaw } from "./base";

export type IReportRaw = {
  type: ReportTypes;
  name: string;
  context: string;
  sumary: string;
  memoryQuantity: number;
  keyWords: string[];
}

export type IReport = IReportRaw & IObjectRaw