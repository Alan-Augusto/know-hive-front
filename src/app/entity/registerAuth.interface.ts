import { IUser } from "./user.interface";

export interface IRegisterAuth extends Omit<IUser, 'id'> {}
