import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#60a5fa",
    },
    secondary: {
      main: "#34d399",
    },
    background: {
      default: "#020617",
      paper: "rgba(15, 23, 42, 0.72)",
    },
    text: {
      primary: "#f8fafc",
      secondary: "rgba(248, 250, 252, 0.68)",
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: "Roboto, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    button: {
      textTransform: "none",
      fontWeight: 700,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          backgroundColor: "#020617",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        variant: "inherit",
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          color: "rgba(248, 250, 252, 0.64)",
          border: 0,
          "&.Mui-selected": {
            color: "#fff",
            backgroundColor: "rgba(255, 255, 255, 0.22)",
          },
          "&.Mui-selected:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.28)",
          },
        },
      },
    },
  },
});
