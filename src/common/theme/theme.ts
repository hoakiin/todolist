import type { ThemeMode } from "@/app/app-slice.ts"
import { createTheme } from "@mui/material/styles"

export const getTheme = (themeMode: ThemeMode) => {
  return createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: "#84A6C0",
        light: "#AFC4D6",
        dark: "#5F7F99",
        contrastText: "#fff",
      },
      secondary: {
        main: "#C08497",
      },
      background: {
        default: themeMode === "light" ? "#F4F7FA" : "#121212",
        paper: themeMode === "light" ? "#FFFFFF" : "#1E1E1E",
      },
      text: {
        primary: themeMode === "light" ? "#2B2F33" : "#EDEDED",
        secondary: themeMode === "light" ? "#6B7280" : "#A0A0A0",
      },
    },
  })
}
