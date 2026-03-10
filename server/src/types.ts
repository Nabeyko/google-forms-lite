export type QuestionType =
  | 'TEXT'
  | 'MULTIPLE_CHOICE'
  | 'CHECKBOX'
  | 'DATE';

export type QuestionInput = {
  title: string;
  type: QuestionType;
  options?: string[];
};

export type AnswerInput = {
  questionId: string;
  value: string[];
};

export type Question = {
  id: string;
  title: string;
  type: QuestionType;
  options?: string[];
};

export type Form = {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
};

export type ResponseItem = {
  id: string;
  formId: string;
  answers: AnswerInput[];
};