import { IQuestionType } from "./quentionType.interface";
import { IUser } from "./user.interface";

export interface IQuestion {
  id?: string;
  statement: string;
  type_id: number;
  type?: IQuestionType;
  created_at?: Date;
  updated_at?: Date;
  author_id: string;
  author?: IUser;
}
