import { createTheme } from "@mui/material/styles";

/**
 * MUI theme for the admin panel, matched to the site's design tokens.
 *
 * The hex values are duplicated from src/index.css rather than read from CSS
 * custom properties, because MUI computes derived colours (hover states,
 * contrast text, disabled variants) at theme-creation time and cannot do that
 * from a `var()`. This is the one place in the codebase where raw hex is
 * correct — the AGENTS.md rule is about components.
 *
 * These are admin-only surfaces, so a drift from the public palette would be
 * cosmetic rather than a contrast failure on anything a visitor sees. The
 * text colours below are the AA-verified ones regardless.
 */
export const adminTheme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#050816", paper: "#0f1224" },
    primary: { main: "#827aff" },
    secondary: { main: "#00d4ff" },
    text: { primary: "#ffffff", secondary: "#94a3b8", disabled: "#7c869e" },
    divider: "#1e2238",
    error: { main: "#ff6b81" },
    success: { main: "#00d4ff" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
    h1: { fontFamily: '"Space Grotesk", system-ui, sans-serif', fontWeight: 700 },
    h2: { fontFamily: '"Space Grotesk", system-ui, sans-serif', fontWeight: 700 },
    h3: { fontFamily: '"Space Grotesk", system-ui, sans-serif', fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none", border: "1px solid #1e2238" },
      },
    },
    MuiTextField: { defaultProps: { variant: "outlined", size: "small" } },
    MuiButton: { defaultProps: { disableElevation: true } },
  },
});
