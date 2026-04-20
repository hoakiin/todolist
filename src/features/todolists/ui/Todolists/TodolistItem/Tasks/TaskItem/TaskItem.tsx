import { EditableSpan } from "@/common/components/EditableSpan/EditableSpan"
import { TaskStatus } from "@/common/enums"
import { createTaskModel } from "@/common/utils"
import { useDeleteTaskMutation, useUpdateTaskMutation } from "@/features/todolists/api/tasksApi"
import type { DomainTask } from "@/features/todolists/api/tasksApi.types"
import DeleteIcon from "@mui/icons-material/Delete"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import type { ChangeEvent } from "react"
import { getListItemSx } from "./TaskItem.styles"
import { DomainTodolist } from "@/features/todolists/lib"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"

type Props = {
  task: DomainTask
  todolist: DomainTodolist
}

export const TaskItem = ({ task, todolist }: Props) => {
  const [updateTask] = useUpdateTaskMutation()
  const [deleteTask] = useDeleteTaskMutation()

  //  DND HOOK
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const deleteTaskHandler = () => {
    deleteTask({ todolistId: todolist.id, taskId: task.id })
  }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New

    const model = createTaskModel(task, { status })

    updateTask({
      taskId: task.id,
      todolistId: todolist.id,
      model,
    })
  }

  const changeTaskTitle = (title: string) => {
    const model = createTaskModel(task, { title })

    updateTask({
      taskId: task.id,
      todolistId: todolist.id,
      model,
    })
  }

  const isTaskCompleted = task.status === TaskStatus.Completed
  const disabled = todolist.entityStatus === "loading"

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      sx={{
        ...getListItemSx(isTaskCompleted),
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      {...attributes}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Checkbox
          checked={isTaskCompleted}
          onChange={changeTaskStatus}
          disabled={disabled}
          onClick={(e) => e.stopPropagation()}
        />

        <EditableSpan value={task.title} onChange={changeTaskTitle} disabled={disabled} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <div
          {...listeners}
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "grab",
          }}
        >
          <DragIndicatorIcon
            sx={{
              fontSize: 18,
              color: "text.secondary",
              "&:hover": { color: "primary.main" },
              opacity: 0.4
            }}
          />
        </div>

        <IconButton
          onClick={(e) => {
            e.stopPropagation()
            deleteTaskHandler()
          }}
          disabled={disabled}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    </ListItem>
  )
}
