import { IUser } from "./user.interface"

export interface IQuestionUserAccess{
    id:string
    user_id:string
    question_id:string
    permission_type_id:number
    user: IUser
}
