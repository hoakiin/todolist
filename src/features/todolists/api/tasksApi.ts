import { baseApi } from "@/app/baseApi"
import { BaseResponse } from "@/common/types"
import type { DomainTask, GetTasksResponse, UpdateTaskModel } from "./tasksApi.types"
import { PAGE_SIZE } from "@/common/constants/constants"

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getTasks: builder.query<GetTasksResponse, { todolistId: string; params: { page: number } }>({
        query: ({ todolistId, params }) => ({
          url: `todo-lists/${todolistId}/tasks`,
          params: { ...params, count: PAGE_SIZE },
        }),
        providesTags: (_res, _err, { todolistId }) => [{ type: "Task", id: todolistId }],
      }),

      createTask: builder.mutation<BaseResponse<{ item: DomainTask }>, { todolistId: string; title: string }>({
        query: ({ todolistId, title }) => {
          return {
            method: "post",
            url: `/todo-lists/${todolistId}/tasks`,
            body: { title },
          }
        },
        invalidatesTags: (_res, _err, { todolistId }) => [{ type: "Task", id: todolistId }],
      }),
      updateTask: builder.mutation<
        BaseResponse<{ item: DomainTask }>,
        { todolistId: string; taskId: string; model: UpdateTaskModel }
      >({
        query: ({ todolistId, taskId, model }) => {
          return {
            method: "put",
            url: `/todo-lists/${todolistId}/tasks/${taskId}`,
            body: model,
          }
        },
        async onQueryStarted({ todolistId, taskId, model }, { dispatch, queryFulfilled, getState }) {
          const cachedArgsForQuery = tasksApi.util.selectCachedArgsForQuery(getState(), "getTasks")

          let patchResults: any[] = []
          cachedArgsForQuery.forEach(({ params }) => {
            patchResults.push(
              dispatch(
                tasksApi.util.updateQueryData("getTasks", { todolistId, params: { page: params.page } }, (state) => {
                  const index = state.items.findIndex((task) => task.id === taskId)
                  if (index !== -1) {
                    state.items[index] = { ...state.items[index], ...model }
                  }
                }),
              ),
            )
          })
          try {
            await queryFulfilled
          } catch {
            patchResults.forEach((patchResult) => {
              patchResult.undo()
            })
          }
        },
        invalidatesTags: (_res, _err, { todolistId }) => [{ type: "Task", id: todolistId }],
      }),
      deleteTask: builder.mutation<BaseResponse, { todolistId: string; taskId: string }>({
        query: ({ todolistId, taskId }) => {
          return {
            method: "delete",
            url: `/todo-lists/${todolistId}/tasks/${taskId}`,
          }
        },
        invalidatesTags: (_res, _err, { todolistId }) => [{ type: "Task", id: todolistId }],
      }),
      reorderTask: builder.mutation({
        query: ({ todolistId, taskId, putAfterItemId }) => ({
          url: `/todo-lists/${todolistId}/tasks/${taskId}/reorder`,
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
  useCreateTaskMutation,
  useGetTasksQuery,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
  useReorderTaskMutation,
} = tasksApi
