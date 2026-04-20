import { styled } from "@mui/material/styles"
import Button from "@mui/material/Button"

type Props = {
  background?: string
}

export const NavButton = styled(Button)<Props>(({ background, theme }) => {
  const isDark = theme.palette.mode === "dark"

  return {
    minWidth: "110px",
    fontWeight: 600,
    borderRadius: "10px",
    textTransform: "none",
    margin: "0 10px",
    padding: "8px 20px",

    color: isDark ? theme.palette.primary.light : theme.palette.primary.contrastText,

    background: background ? background : isDark ? "transparent" : theme.palette.primary.dark,

    border: isDark ? `1px solid ${theme.palette.primary.main}` : "none",

    boxShadow: isDark ? "none" : `0 2px 6px rgba(0,0,0,0.1)`,

    transition: "all 0.2s ease",

    "&:hover": {
      background: isDark ? "rgba(132,166,192,0.1)" : theme.palette.primary.dark,
      boxShadow: isDark ? "none" : `0 4px 10px rgba(0,0,0,0.15)`,
    },

    "&:active": {
      transform: "scale(0.98)",
    },
  }
})
