import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:4000',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function graphqlRequest(
  query: string,
  variables?: Record<string, unknown>,
) {
  const result = await baseQuery(
    {
      url: '',
      body: { query, variables },
    },
    {} as never,
    {} as never,
  );

  if (result.error) {
    return { error: result.error };
  }

  const response = result.data as {
    data?: unknown;
    errors?: { message: string }[];
  };

  if (response.errors?.length) {
    return {
      error: {
        status: 400,
        data: response.errors,
      },
    };
  }

  return { data: response.data };
}