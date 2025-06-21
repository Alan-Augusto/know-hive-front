import { IUser } from "./user.interface";
import { ICollectionUserAccess } from "./collectionUserAccess.interface";
import { IQuestion } from "./question.interface";

export interface ICollection {
  id?: string;
  title: string;
  description: string;
  author_id: string;
  is_public: boolean;
  author?: IUser;
  permissions?: ICollectionUserAccess[];
  created_at?: Date;
  updated_at?: Date;
  questions_ids?: string[];
  questions?: IQuestion[]; // Assuming questions are stored as an array of strings
}
