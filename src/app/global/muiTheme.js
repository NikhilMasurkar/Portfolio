import { createTheme } from "@mui/material/styles";


const TOKENS = {
  bg: "#050816",
  surface: "#0f1224",
  surfaceRaised: "#1a1f2e",
  line: "#1e2238",
  lineRaised: "#262c47",
  fg: "#ffffff",
  fg2: "#e6e9f5",
  muted: "#94a3b8",
  meta: "#7c869e",
  primary: "#6c63ff",
  primaryText: "#827aff",
  accent: "#a855f7",
  secondary: "#00d4ff",
};

export const publicTheme = createTheme({
  palette: {
    mode: "dark",
    background: { default: TOKENS.bg, paper: TOKENS.surface },
    primary: { main: TOKENS.primaryText, contrastText: TOKENS.fg },
    secondary: { main: TOKENS.secondary, contrastText: TOKENS.bg },
    text: { primary: TOKENS.fg, secondary: TOKENS.muted, disabled: TOKENS.meta },
    divider: TOKENS.line,
  },

  shape: { borderRadius: 12 },

  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
    h1: { fontFamily: '"Space Grotesk", system-ui, sans-serif', fontWeight: 700, letterSpacing: "-0.035em" },
    h2: { fontFamily: '"Space Grotesk", system-ui, sans-serif', fontWeight: 700, letterSpacing: "-0.02em" },
    h3: { fontFamily: '"Space Grotesk", system-ui, sans-serif', fontWeight: 600, letterSpacing: "-0.015em" },
    button: { textTransform: "none", fontWeight: 600 },
  },

  components: {
  
    MuiCssBaseline: {
      styleOverrides: { body: { backgroundColor: "transparent" } },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 12, paddingInline: 22, paddingBlock: 12 },
      },
    },
    MuiPaper: {
      styleOverrides: {

        root: { backgroundImage: "none" },
      },
    },
    /*
     * Inputs, styled here rather than per form. The site's fields sit on the
     * page background with a hairline border, not on MUI's default filled
     * grey, and the label has to clear AA against that background — hence
     * `muted` for rest and the brighter `fg2` for focus.
     */
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: TOKENS.bg,
          borderRadius: 12,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: TOKENS.line },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: TOKENS.lineRaised },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: TOKENS.primaryText,
            borderWidth: 1,
          },
        },
        input: { color: TOKENS.fg, fontSize: 15 },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { color: TOKENS.muted, "&.Mui-focused": { color: TOKENS.fg2 } },
      },
    },

    MuiLink: {
      defaultProps: { underline: "hover" },
      styleOverrides: { root: { color: TOKENS.secondary } },
    },
  },
});

export default publicTheme;
