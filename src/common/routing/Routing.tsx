import { Main } from "@/app/Main"
import { PageNotFound, ProtectedRoutes } from "@/common/components"
import { Login } from "@/features/auth/ui/Login/Login"
import { Route, Routes } from "react-router"
import { useAppSelector } from "../hooks"
import { selectIsLoggedIn } from "@/app/app-slice"

export const Path = {
  Main: "/",
  Login: "/login",
  NotFound: "*",
} as const

export const Routing = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  return (
    <Routes>
      <Route
        path={Path.Main}
        element={
          <ProtectedRoutes redirectPath={Path.Login} isAllowed={!isLoggedIn}>
            <Main />
          </ProtectedRoutes>
        }
      />
      <Route
        path={Path.Login}
        element={
          <ProtectedRoutes redirectPath={Path.Main} isAllowed={isLoggedIn}>
            <Login />
          </ProtectedRoutes>
        }
      />
      <Route path={Path.NotFound} element={<PageNotFound />} />
    </Routes>
  )
}
