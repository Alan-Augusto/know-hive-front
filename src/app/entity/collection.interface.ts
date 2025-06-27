import { IUser } from "./user.interface";
import { ICollectionUserAccess } from "./collectionUserAccess.interface";
import { IQuestion } from "./question.interface";

export interface ICollection {
  id?: string;
  title: string;
  description: string;
  author_id: string;
  is_public: boolean;
  is_liked: boolean;
  author?: IUser;
  shared_with_me?: boolean; // Indicates if the collection is shared with the user
  tags?: string[];
  permissions?: ICollectionUserAccess[];
  created_at?: string;
  upstringd_at?: Date;
  questions_ids?: string[];
  questions?: IQuestion[]; // Assuming questions are stored as an array of strings
}
