import { GraphQLError } from 'graphql';
import { forms, responsesStore } from './data';
import type { QuestionInput, AnswerInput } from './types';
import {
  generateFormId,
  generateQuestionId,
  generateResponseId,
} from './utils/id';

export const typeDefs = `#graphql
  enum QuestionType {
    TEXT
    MULTIPLE_CHOICE
    CHECKBOX
    DATE
  }

  type Question {
    id: ID!
    title: String!
    type: QuestionType!
    options: [String!]
  }

  type Form {
    id: ID!
    title: String!
    description: String
    questions: [Question!]!
  }

  type Answer {
    questionId: ID!
    value: [String!]!
  }

  type Response {
    id: ID!
    formId: ID!
    answers: [Answer!]!
  }

  input QuestionInput {
    title: String!
    type: QuestionType!
    options: [String!]
  }

  input AnswerInput {
    questionId: ID!
    value: [String!]!
  }

  type Query {
    forms: [Form!]!
    form(id: ID!): Form
    responses(formId: ID!): [Response!]!
  }

  type Mutation {
    createForm(
      title: String!
      description: String
      questions: [QuestionInput!]
    ): Form!

    submitResponse(
      formId: ID!
      answers: [AnswerInput!]!
    ): Response!
  }
`;

export const resolvers = {
  Query: {
    forms: () => forms,
    form: (_: unknown, { id }: { id: string }) => forms.find((f) => f.id === id),
    responses: (_: unknown, { formId }: { formId: string }) =>
      responsesStore.filter((r) => r.formId === formId),
  },

  Mutation: {
    createForm: (_: unknown, { title, description, questions = [] }: {
      title: string;
      description?: string;
      questions: QuestionInput[];
    }) => {
      if (!title.trim()) {
        throw new GraphQLError('Form title cannot be empty');
      }

      if (questions.length === 0) {
        throw new GraphQLError('Form must have at least one question');
      }

      const newForm = {
        id: generateFormId(),
        title: title.trim(),
        description: description?.trim(),
        questions: questions.map((q) => {
          if (!q.title.trim()) {
            throw new GraphQLError('Each question must have a title');
          }
          return {
            id: generateQuestionId(),
            title: q.title.trim(),
            type: q.type,
            options: q.options ?? [],
          };
        }),
      };

      forms.push(newForm);
      return newForm;
    },

    submitResponse: (_: unknown, { formId, answers }: {
      formId: string;
      answers: AnswerInput[];
    }) => {
      const formExists = forms.some(f => f.id === formId);
      if (!formExists) {
        throw new GraphQLError('Cannot submit response: Form not found');
      }

      const validAnswers = answers.filter(a => a.value.length > 0 && a.value[0] !== "");
      
      if (validAnswers.length === 0) {
        throw new GraphQLError('You must answer at least one question');
      }

      const newResponse = {
        id: generateResponseId(),
        formId,
        answers: validAnswers,
      };

      responsesStore.push(newResponse);
      return newResponse;
    },
  },
};