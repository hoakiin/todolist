import List from "@mui/material/List"
import { useEffect, useState } from "react"
import { DndContext, closestCenter } from "@dnd-kit/core"
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useGetTasksQuery, useReorderTaskMutation } from "@/features/todolists/api/tasksApi"
import { TaskItem } from "./TaskItem/TaskItem"
import { TasksSkeleton } from "./TasksSkeleton/TasksSkeleton"
import { TasksPagination } from "./TasksPagination/TasksPagination"
import { DomainTodolist } from "@/features/todolists/lib"
import { PAGE_SIZE } from "@/common/constants/constants"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const { id, filter } = todolist

  const [page, setPage] = useState(1)

  const { data, isLoading } = useGetTasksQuery({
    todolistId: id,
    params: { page },
  })

  const [reorderTask] = useReorderTaskMutation()

  const [tasks, setTasks] = useState(data?.items ?? [])

  useEffect(() => {
    if (data?.items) {
      setTasks(data.items)
    }
  }, [data, page])

  useEffect(() => {
    if (!data) return

    const totalPages = Math.ceil(data.totalCount / PAGE_SIZE)
    if (page > totalPages) {
      setPage(totalPages || 1)
    }
  }, [data?.totalCount, page])

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setTasks((prev) => {
      const oldIndex = prev.findIndex((t) => t.id === active.id)
      const newIndex = prev.findIndex((t) => t.id === over.id)

      const newArray = arrayMove(prev, oldIndex, newIndex)

      reorderTask({
        todolistId: id,
        taskId: active.id,
        putAfterItemId: over.id,
      })

      return newArray
    })
  }

  if (isLoading) return <TasksSkeleton />

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return task.status === 0
    if (filter === "completed") return task.status === 2
    return true
  })

  return (
    <>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={filteredTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <List>
            {filteredTasks.length === 0 ? (
              <p>Тасок нет</p>
            ) : (
              filteredTasks.map((task) => <TaskItem key={task.id} task={task} todolist={todolist} />)
            )}
          </List>
        </SortableContext>
      </DndContext>
      
      <TasksPagination totalCount={data?.totalCount || 0} page={page} setPage={setPage} />
    </>
  )
}
