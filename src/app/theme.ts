"use client";
import { Roboto } from "next/font/google";
import { createTheme, ThemeOptions } from "@mui/material/styles";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const themeOptions: ThemeOptions = {
  typography: {
    fontFamily: roboto.style.fontFamily,
    fontSize: 14,
    body1: {
      fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
    },
  },
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#212121",
      secondary: "#757575",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          color: "#212121",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          padding: "clamp(8px, 2vw, 16px)",
          margin: "clamp(8px, 2vw, 16px)",
          width: "100%",
          maxWidth: "1200px",
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          color: "#212121",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "1200px",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "clamp(6px, 1.5vw, 12px)",
          borderBottom: "1px solid #e0e0e0",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#f5f5f5",
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          padding: "clamp(8px, 2vw, 16px)",
          margin: "clamp(8px, 2vw, 16px)",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "1200px",
          fontSize: "clamp(0.8rem, 1.5vw, 1rem)",
        },
      },
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;
