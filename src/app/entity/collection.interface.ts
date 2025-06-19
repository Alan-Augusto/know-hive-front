import { IUser } from "./user.interface";
import { ICollectionUserAccess } from "./collectionUserAccess.interface";

export interface ICollection {
  id?: string;
  title: string;
  description: string;
  author_id: string;
  author?: IUser;
  permissions?: ICollectionUserAccess[];
  created_at?: Date;
  updated_at?: Date;
}
