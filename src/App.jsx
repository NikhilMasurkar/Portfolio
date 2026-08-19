import React from "react";
import { BrowserRouter } from "react-router";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import createCacheImport from "@emotion/cache";
import { publicTheme } from "./app/global/muiTheme.js";
import { ContentProvider } from "./app/global/ContentContext.jsx";
import { PageRoutes } from "./app/router/Routes";

const createCache = createCacheImport.default ?? createCacheImport;
const clientCache = createCache({ key: "nm", prepend: true });

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
