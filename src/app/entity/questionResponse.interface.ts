export interface IQuestionResponseResult {
  isCorrect: boolean;
  correctAlternatives: string[];
  userAlternatives: string[];
  explanation?: string;
}


export interface ICreateQuestionResponse {
  question_id: string;
  user_id: string;
  alternative_ids: string[];
  response_time?: number;
  collection_id?: string;
}

export interface IUpdateQuestionResponse {
  alternative_id?: string;
  response_time?: number;
  collection_id?: string;
}

export interface IGetResponsesQuery {
  user_id?: string;
  question_id?: string;
  collection_id?: string;
}

export interface IGetUserStats {
  collection_id?: string;
}

export interface IQuestionResponseFull {
  id: string;
  question_id: string;
  user_id: string;
  alternative_id: string;
  collection_id?: string;
  response_time: number;
  answered_at: string;
  is_correct: boolean;
  question: {
    id: string;
    statement: string;
    title: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
  alternative: {
    id: string;
    text: string;
    is_correct: boolean;
  };
  collection?: {
    id: string;
    title: string;
  };
}

export interface IUserStats {
  user_id: string;
  collection_id?: string;
  total_responses: number;
  correct_responses: number;
  incorrect_responses: number;
  accuracy_percentage: number;
  total_time_seconds: number;
  average_time_seconds: number;
}

export interface IQuestionStats {
  question_id: string;
  total_responses: number;
  correct_responses: number;
  incorrect_responses: number;
  accuracy_percentage: number;
  average_time_seconds: number;
  alternative_stats: IAlternativeStats[];
}

export interface IAlternativeStats {
  alternative_id: string;
  text: string;
  is_correct: boolean;
  selection_count: number;
}

export interface ICollectionStats {
  collection_id: string;
  total_responses: number;
  correct_responses: number;
  incorrect_responses: number;
  accuracy_percentage: number;
  average_time_seconds: number;
  question_stats: IQuestionStatsInCollection[];
}

export interface IQuestionStatsInCollection {
  question_id: string;
  question_title: string;
  question_statement: string;
  total_responses: number;
  correct_responses: number;
}
