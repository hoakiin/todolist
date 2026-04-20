import { ReactNode } from "react"
import { Navigate } from "react-router"

type Props = {
  children: ReactNode
  redirectPath: string
  isAllowed: boolean
}

export const ProtectedRoutes = ({ children, redirectPath, isAllowed }: Props) => {
  if (isAllowed) {
    return <Navigate to={redirectPath} />
  }

  return children
}
