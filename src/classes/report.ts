import { ReportTypes } from '../commons/enums/report';
import { IReport } from '../commons/interfaces/report';
import { ObjectRaw } from './commonFields';

export class Report extends ObjectRaw implements IReport {
  type: ReportTypes;
  name: string;
  context: string;
  sumary: string;
  memoryQuantity: number;
  keyWords: string[];

  constructor(report: IReport) {
    super(report);
    this.type = report.type;
    this.name = report.name;
    this.context = report.context;
    this.sumary = report.sumary;
    this.memoryQuantity = report.memoryQuantity;
    this.keyWords = report.keyWords;
  }
}