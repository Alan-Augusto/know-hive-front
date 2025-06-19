import { IAlternative } from "./alternative.interface";
import { IQuestionType } from "./quentionType.interface";
import { IQuestionUserAccess } from "./questionUserAccess.interface";
import { IUser } from "./user.interface";

export interface IQuestion {
  id?: string;
  title: string;
  statement: string;
  type_id: number;
  type?: IQuestionType;
  created_at?: Date;
  updated_at?: Date;
  author_id: string;
  is_public: boolean;
  author?: IUser;
  alternatives?: IAlternative[];
  permissions?: IQuestionUserAccess[];
}
