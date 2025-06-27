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
  is_liked: boolean;
  created_at?: string;
  upstringd_at?: Date;
  author_id: string;
  is_public: boolean;
  author?: IUser;
  shared_with_me?: boolean;
  alternatives?: IAlternative[];
  permissions?: IQuestionUserAccess[];
  tags?: string[];
}
