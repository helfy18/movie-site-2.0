import { createTheme } from "@mui/material/styles";
import { colors, fontSans } from "./tokens";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: colors.accent },
    secondary: { main: colors.accent },
    background: { default: colors.background, paper: colors.card },
    text: {
      primary: colors.accent,
      secondary: colors.light,
      disabled: colors.muted,
    },
    action: { disabled: colors.muted },
  },
  typography: { fontFamily: fontSans },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiSelect: { styleOverrides: { icon: { color: colors.accent } } },
  },
});

export default theme;
