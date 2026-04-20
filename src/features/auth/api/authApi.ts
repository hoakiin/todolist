import { baseApi } from "@/app/baseApi"
import type { BaseResponse } from "@/common/types"
import { LoginInputs } from "../lib/schemas"

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      login: builder.mutation<BaseResponse<{ userId: number; token: string }>, LoginInputs>({
        query: (body) => {
          return {
            method: "post",
            url: "/auth/login",
            body,
          }
        },
      }),
      logout: builder.mutation<BaseResponse, void>({
        query: () => {
          return {
            method: "delete",
            url: "/auth/login",
          }
        },
      }),
      me: builder.query<BaseResponse<{ id: string; email: string; login: string }>, void>({
        query: () => {
          return {
            url: "/auth/me",
          }
        },
      }),
    }
  },
})

export const {useLoginMutation, useMeQuery, useLogoutMutation } = authApi
