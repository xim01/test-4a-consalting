// src/lib/features/api/apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TariffsResponse } from "app/types/tariff";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/",
    responseHandler: async (response: Response) => {
      const text = await response.text();
      try {
        return JSON.parse(text) as unknown; // неправильно настроены заголовки на стороне сервера временый костыль
      } catch {
        return text;
      }
    },
  }),
  tagTypes: ["Tariffs"],
  endpoints: (builder) => ({
    getTariffs: builder.query<TariffsResponse, void>({
      query: () => "/api/proxy-tariffs",
      providesTags: ["Tariffs"],
    }),
  }),
});

export const { useGetTariffsQuery } = apiSlice;
