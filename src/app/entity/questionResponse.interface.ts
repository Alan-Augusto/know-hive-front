export interface IQuestionResponse {
  questionId: string;
  selectedAlternativeIds: string[];
  isCorrect?: boolean;
  score?: number;
}

export interface IQuestionResponseResult {
  isCorrect: boolean;
  correctAlternatives: string[];
  userAlternatives: string[];
  explanation?: string;
}
