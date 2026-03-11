import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequest } from '../services/graphql';
import type { Form, FormResponse } from '../types';
import type { QuestionType } from '../types/enums';

type CreateFormData = {
  title: string;
  description?: string;
  questions: {
    title: string;
    type: QuestionType;
    options?: string[];
  }[];
};

type SubmitResponseData = {
  formId: string;
  answers: {
    questionId: string;
    value: string[];
  }[];
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: async () => ({ data: {} }),
  tagTypes: ['Forms', 'Responses'],
  endpoints: (builder) => ({
    getForms: builder.query<Form[], void>({
      async queryFn() {
        const result = await graphqlRequest(`
          query {
            forms {
              id
              title
              description
              questions {
                id
                title
                type
                options
              }
            }
          }
        `);

        if ('error' in result) return { error: result.error };
        return { data: (result.data as { forms: Form[] }).forms };
      },
      providesTags: ['Forms'],
    }),

    getFormById: builder.query<Form, string>({
      async queryFn(id) {
        const result = await graphqlRequest(
          `
          query ($id: ID!) {
            form(id: $id) {
              id
              title
              description
              questions {
                id
                title
                type
                options
              }
            }
          }
          `,
          { id },
        );

        if ('error' in result) return { error: result.error };
        return { data: (result.data as { form: Form }).form };
      },
      providesTags: ['Forms'],
    }),

    getResponses: builder.query<FormResponse[], string>({
      async queryFn(formId) {
        const result = await graphqlRequest(
          `
          query ($formId: ID!) {
            responses(formId: $formId) {
              id
              formId
              answers {
                questionId
                value
              }
            }
          }
          `,
          { formId },
        );

        if ('error' in result) return { error: result.error };
        return {
          data: (result.data as { responses: FormResponse[] }).responses,
        };
      },
      providesTags: ['Responses'],
    }),

    createForm: builder.mutation<Form, CreateFormData>({
      async queryFn(formData) {
        const result = await graphqlRequest(
          `
          mutation ($title: String!, $description: String, $questions: [QuestionInput!]) {
            createForm(title: $title, description: $description, questions: $questions) {
              id
              title
              description
              questions {
                id
                title
                type
                options
              }
            }
          }
          `,
          formData,
        );

        if ('error' in result) return { error: result.error };
        return {
          data: (result.data as { createForm: Form }).createForm,
        };
      },
      invalidatesTags: ['Forms'],
    }),

    submitResponse: builder.mutation<FormResponse, SubmitResponseData>({
      async queryFn(responseData) {
        const result = await graphqlRequest(
          `
          mutation ($formId: ID!, $answers: [AnswerInput!]!) {
            submitResponse(formId: $formId, answers: $answers) {
              id
              formId
              answers {
                questionId
                value
              }
            }
          }
          `,
          responseData,
        );

        if ('error' in result) return { error: result.error };
        return {
          data: (result.data as { submitResponse: FormResponse }).submitResponse,
        };
      },
      invalidatesTags: ['Responses'],
    }),
  }),
});

export const {
  useGetFormsQuery,
  useGetFormByIdQuery,
  useGetResponsesQuery,
  useCreateFormMutation,
  useSubmitResponseMutation,
} = api;