import React, { useState, useEffect, createContext, useContext } from "react";
import { createTheme, ThemeProvider } from "@mui/material";

const ThemeModeContext = createContext();

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within AppThemeProvider");
  }
  return context;
};

const isNightTime = () => {
  const currentHour = new Date().getHours();
  return currentHour >= 18 || currentHour < 6;
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
        main: "#D4AF37",
      },
      secondary: {
        main: isDarkMode ? "#BB86FC" : "#1E1E1F",
      },
      background: {
        default: isDarkMode ? "#121212" : "#ffffff",
        paper: isDarkMode ? "#1E1E1E" : "#f5f5f5",
      },
      text: {
        primary: isDarkMode ? "#FFFFFF" : "#1E1E1F",
        secondary: isDarkMode ? "#B3B3B3" : "#555555",
      },
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
  const [isDarkMode, setIsDarkMode] = useState(() => isNightTime());
  const [isManualMode, setIsManualMode] = useState(false);

  useEffect(() => {
    if (isManualMode) return;

    const checkTime = () => {
      const shouldBeDark = isNightTime();
      if (shouldBeDark !== isDarkMode) {
        setIsDarkMode(shouldBeDark);
      }
    };

    checkTime();

    const interval = setInterval(checkTime, 60000);

    return () => clearInterval(interval);
  }, [isDarkMode, isManualMode]);

  const toggleTheme = () => {
    setIsManualMode(true);
    setIsDarkMode((prev) => !prev);
  };

  const setLightMode = () => {
    setIsManualMode(true);
    setIsDarkMode(false);
  };

  const setDarkMode = () => {
    setIsManualMode(true);
    setIsDarkMode(true);
  };

  const setAutoMode = () => {
    setIsManualMode(false);
    setIsDarkMode(isNightTime());
  };

  const theme = createAppTheme(isDarkMode);

  const contextValue = {
    isDarkMode,
    toggleTheme,
    setLightMode,
    setDarkMode,
    setAutoMode,
    isAutoMode: !isManualMode,
  };

  return (
    <ThemeModeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
