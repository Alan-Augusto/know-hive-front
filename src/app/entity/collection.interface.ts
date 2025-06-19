import { IUser } from "./user.interface";

export interface ICollection {
  id?: string;
  title: string;
  description: string;
  author_id: string;
  author?: IUser;
  created_at?: Date;
  updated_at?: Date;
}
