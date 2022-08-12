import { createTheme } from "@mui/material/styles";
import { COLOR } from "./color";

export const theme = createTheme({
  spacing: 8,
  palette: {
    background: { default: COLOR.BACKGROUND_DEFAULT },
    text: {
      primary: COLOR.TEXT_PRIMARY,
      secondary: COLOR.TEXT_SECONDARY,
    },
    primary: {
      main: COLOR.PRIMARY_MAIN,
    },
    secondary: {
      main: COLOR.SECONDARY_MAIN,
    },
  },
  typography: {
    fontFamily: [
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "'Segoe UI'",
      "Roboto",
      "Oxygen",
      "Ubuntu",
      "Cantarell",
      "'Fira Sans'",
      "'Droid Sans'",
      "'Helvetica Neue'",
      "sans-serif",
    ].join(", "),
    button: {
      textTransform: "none",
    },
  },
});
