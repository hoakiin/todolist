import { baseApi } from "@/app/baseApi"
import type { BaseResponse } from "@/common/types"
import { DomainTodolist } from "../lib"
import type { Todolist } from "./todolistsApi.types"

export const todolistsApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getTodolists: builder.query<DomainTodolist[], void>({
        query: () => "/todo-lists",
        providesTags: ["Todolist"],
        transformResponse: (todolists: Todolist[]) => {
          return todolists.map((todolist) => ({ ...todolist, filter: "all", entityStatus: "idle" }))
        },
      }),
      createTodolist: builder.mutation<BaseResponse<{ item: Todolist }>, string>({
        query: (title) => {
          return {
            method: "post",
            url: "/todo-lists",
            body: { title },
          }
        },
        invalidatesTags: ["Todolist"],
      }),
      changeTodolistTitle: builder.mutation<BaseResponse, { id: string; title: string }>({
        query: ({ id, title }) => {
          return {
            method: "put",
            url: `/todo-lists/${id}`,
            body: { title },
          }
        },
        invalidatesTags: ["Todolist"],
      }),
      deleteTodolist: builder.mutation<BaseResponse, string>({
        query: (id) => {
          return {
            method: "delete",
            url: `/todo-lists/${id}`,
          }
        },
        async onQueryStarted(id: string, { dispatch, queryFulfilled }) {
          const patchResult = dispatch(
            todolistsApi.util.updateQueryData("getTodolists", undefined, (state) => {
              const index = state.findIndex((todolist) => todolist.id === id)
              if (index !== -1) {
                state.splice(index, 1)
              }
            }),
          )

          try {
            await queryFulfilled
          } catch {
            patchResult.undo()
          }
        },
        invalidatesTags: ["Todolist"],
      }),
      reorderTodolist: builder.mutation({
        query: ({ todolistId, putAfterItemId }) => ({
          url: `/todo-lists/${todolistId}/reorder`,
          method: "PUT",
          body: {
            putAfterItemId,
          },
        }),
      }),
    }
  },
})

export const {
  useGetTodolistsQuery,
  useCreateTodolistMutation,
  useDeleteTodolistMutation,
  useChangeTodolistTitleMutation,
  useReorderTodolistMutation
} = todolistsApi
