// Types and interfaces specific to QuestionFormComponent

export interface QuestionFormData {
  id: string | null;
  title: string | null;
  statement: string | null;
  type: number | null;
  alternatives: AlternativeFormData[];
  author_id: string;
  created_at: Date | null;
}

export interface AlternativeFormData {
  id: string | null;
  text: string;
  is_correct: boolean;
}

export interface QuestionFormDialogData {
  question?: string;
  mode?: 'create' | 'edit';
}

// Constants for the component
export const VALIDATION_MESSAGES = {
  TITLE_REQUIRED: 'Título é obrigatório.',
  STATEMENT_REQUIRED: 'Descrição é obrigatória.',
  TYPE_REQUIRED: 'Tipo de questão é obrigatório.',
  MIN_ALTERNATIVES: 'É necessário ter pelo menos 2 alternativas válidas.',
  CORRECT_ALTERNATIVE_REQUIRED: 'É necessário marcar pelo menos uma alternativa como correta.',
  MIN_ALTERNATIVE_ERROR: 'É necessário ter pelo menos uma alternativa.'
} as const;

export const SUCCESS_MESSAGES = {
  QUESTION_CREATED: 'Questão criada com sucesso!',
  QUESTION_UPDATED: 'Questão atualizada com sucesso!'
} as const;

export const ERROR_MESSAGES = {
  LOAD_QUESTION: 'Erro ao carregar a questão.',
  CREATE_QUESTION: 'Erro ao criar questão.',
  UPDATE_QUESTION: 'Erro ao atualizar questão.',
  MISSING_ID: 'Erro: ID da questão não encontrado.',
  LOAD_QUESTION_TYPES: 'Erro ao carregar tipos de questão.'
} as const;

export const FORM_CONSTANTS = {
  MIN_ALTERNATIVES_COUNT: 2,
  DEFAULT_ALTERNATIVES_COUNT: 2
} as const;
