import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000/api', // Update for production
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as any;
    const token = state.auth?.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User', 'Subject', 'Vocabulary'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<
      { user: any; token: string },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<
      { user: any; token: string },
      { email: string; username: string; password: string; firstName?: string; lastName?: string }
    >({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    getProfile: builder.query<{ user: any }, void>({
      query: () => '/auth/profile',
      providesTags: ['User'],
    }),
    
    // Subject endpoints
    getSubjects: builder.query<{ subjects: any[] }, void>({
      query: () => '/subjects',
      providesTags: ['Subject'],
    }),
    getSubjectById: builder.query<{ subject: any }, string>({
      query: (id) => `/subjects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Subject', id }],
    }),
    
    // Vocabulary endpoints
    searchVocabulary: builder.query<{ vocabulary: any[] }, string>({
      query: (searchTerm) => `/vocabulary/search?q=${searchTerm}`,
      providesTags: ['Vocabulary'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useGetSubjectsQuery,
  useGetSubjectByIdQuery,
  useSearchVocabularyQuery,
} = apiSlice;