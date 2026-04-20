import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import { useGetTodolistsQuery } from "../../api/todolistsApi"
import { TodolistItem } from "./TodolistItem/TodolistItem"
import { containerSx } from "@/common/styles"
import { Box } from "@mui/material"
import { TodolistSkeleton } from "./TodolistSkeleton/TodolistSkeleton "

export const Todolists = () => {
  const { data, isLoading } = useGetTodolistsQuery()

  if (isLoading) {
    return (
      <Box sx={containerSx} style={{ gap: "32px" }}>
        {Array(3)
          .fill(null)
          .map((_, id) => (
            <TodolistSkeleton key={id} />
          ))}
      </Box>
    )
  }

  return (
    <>
      {data?.map((todolist) => (
        <Grid key={todolist.id}>
          <Paper sx={{ p: "0 20px 20px 20px" }}>
            <TodolistItem todolist={todolist} />
          </Paper>
        </Grid>
      ))}
    </>
  )
}
