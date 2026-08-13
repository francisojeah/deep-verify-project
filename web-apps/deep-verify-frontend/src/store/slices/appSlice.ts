import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../lib/api";
import type { RootState } from "../store";

const baseQuery = fetchBaseQuery({
  baseUrl: `${API_BASE_URL}/backend/v1`,
  prepareHeaders: (headers, { getState }) => {
    // The token lives on the user slice. This previously read state.auth,
    // which does not exist, so the header was never sent.
    const token = (getState() as RootState)?.user?.token;
    if (token) {
      headers.set("x-access-token", token);
    }
    return headers;
  },
});

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
  }),
});

export const { useLoadUserQuery } = appApi;
