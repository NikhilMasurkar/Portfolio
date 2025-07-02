import React, { useState, useEffect, createContext, useContext } from "react";
import { createTheme, ThemeProvider } from "@mui/material";

// Create a context for theme mode
const ThemeModeContext = createContext();

// Custom hook to use theme mode
export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within AppThemeProvider");
  }
  return context;
};

const isNightTime = () => {
  const currentHour = new Date().getHours();
  return currentHour >= 14 || currentHour < 6;
};

const createAppTheme = (isDarkMode) => {
  return createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: "#D4AF37", // gold - same for both modes
      },
      secondary: {
        main: isDarkMode ? "#BB86FC" : "#1E1E1F", // purple for dark, dark gray for light
      },
      background: {
        default: isDarkMode ? "#121212" : "#ffffff",
        paper: isDarkMode ? "#1E1E1E" : "#f5f5f5",
      },
      text: {
        primary: isDarkMode ? "#FFFFFF" : "#1E1E1F",
        secondary: isDarkMode ? "#B3B3B3" : "#555555",
      },
      // Additional colors for better dark mode support
      divider: isDarkMode ? "#333333" : "#E0E0E0",
      action: {
        hover: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
        selected: isDarkMode
          ? "rgba(255, 255, 255, 0.12)"
          : "rgba(0, 0, 0, 0.08)",
      },
    },
    typography: {
      fontFamily: ["Poppins", "Roboto", "Arial", "sans-serif"].join(","),
      h1: { fontWeight: 700 },
      h2: { fontWeight: 600 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 500 },
      h5: { fontWeight: 500 },
      h6: { fontWeight: 500 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: "none",
            fontWeight: 600,
          },
          contained: {
            boxShadow: "none",
            "&:hover": {
              boxShadow: isDarkMode
                ? "0px 4px 10px rgba(212, 175, 55, 0.3)"
                : "0px 4px 10px rgba(0, 0, 0, 0.1)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: isDarkMode
              ? "0px 4px 20px rgba(0, 0, 0, 0.3)"
              : "0px 4px 20px rgba(0, 0, 0, 0.05)",
            border: isDarkMode ? "1px solid #333333" : "none",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: isDarkMode ? "none" : undefined,
          },
        },
      },
    },
  });
};

export default function AppThemeProvider(props) {
  const { children } = props;
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

  // Remove automatic time-based switching for manual control

  // Manual toggle function (optional - for user control)
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Force light mode
  const setLightMode = () => {
    setIsDarkMode(false);
  };

  // Force dark mode
  const setDarkMode = () => {
    setIsDarkMode(true);
  };

  // Reset to auto (time-based)
  const setAutoMode = () => {
    setIsDarkMode(isNightTime());
  };

  const theme = createAppTheme(isDarkMode);

  const contextValue = {
    isDarkMode,
    toggleTheme,
    setLightMode,
    setDarkMode,
    setAutoMode,
    isAutoMode: false, // Manual control mode
  };

  return (
    <ThemeModeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
