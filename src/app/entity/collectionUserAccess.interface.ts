import { IUser } from "./user.interface";

export interface ICollectionUserAccess {
  id?: string;
  user_id: string;
  collection_id: string;
  permission_type_id: number;
  user?: IUser;
  created_at?: Date;
  updated_at?: Date;
}
