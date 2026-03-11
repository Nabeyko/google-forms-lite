import { QuestionType } from '../types/enums';
import type { DraftQuestion } from '../components/QuestionEditor';
import type { Answer, Question } from '../types';

export const cleanQuestions = (questions: DraftQuestion[]) => {
  return questions.map((q) => ({
    title: q.title.trim(),
    type: q.type,
    options: [QuestionType.MULTIPLE_CHOICE, QuestionType.CHECKBOX].includes(q.type)
      ? q.options.map(opt => opt.trim()).filter(opt => opt !== "")
      : [],
  }));
};

export const createEmptyQuestion = (type: QuestionType = QuestionType.TEXT): DraftQuestion => ({
  title: "",
  type,
  options: [QuestionType.MULTIPLE_CHOICE, QuestionType.CHECKBOX].includes(type) ? [""] : [],
});

export const prepareAnswersPayload = (questions: Question[], answers: Record<string, string[]>): Answer[] => {
  return questions
    .map((question) => ({
      questionId: question.id,
      value: answers[question.id] || [],
    }))
    .filter((answer) => answer.value.length > 0);
};