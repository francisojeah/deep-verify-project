import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the base query
const baseQuery = fetchBaseQuery({
  // baseUrl: "http://localhost:3000/backend/v1",
  baseUrl: "https://deep-verify-backend.onrender.com/backend/v1",
  prepareHeaders: (headers, { getState }: any) => {
    const token = getState()?.auth?.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Create an API slice
export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery,
  tagTypes: ["User"],
  keepUnusedDataFor: 0,
  endpoints: (builder) => ({
    loadUser: builder.query<any, void>({
      query: () => "users/user",
      providesTags: ["User"],
    }),
  })
});

// Export hooks for usage in functional components
export const {
  useLoadUserQuery
} = appApi;
