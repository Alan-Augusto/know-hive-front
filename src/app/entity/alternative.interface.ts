export interface IAlternative {
  id?: string;
  text: string;
  is_correct: boolean;
  question_id: string;
  created_at?: Date;
  updated_at?: Date;
}
