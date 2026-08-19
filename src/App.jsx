import React from "react";
import { BrowserRouter } from "react-router";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { publicTheme } from "./app/global/muiTheme.js";
import createEmotionCache from "./app/global/emotionCache.js";
import { ContentProvider } from "./app/global/ContentContext.jsx";
import { PageRoutes } from "./app/router/Routes";

// One cache for the lifetime of the tab; the server makes one per request.
const clientCache = createEmotionCache();

export default function App({ content }) {
  return (
    <CacheProvider value={clientCache}>
      <ThemeProvider theme={publicTheme}>
        <CssBaseline />
        <ContentProvider content={content}>
          <BrowserRouter>
            <PageRoutes />
          </BrowserRouter>
        </ContentProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
