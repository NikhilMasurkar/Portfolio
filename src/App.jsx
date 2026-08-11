import { lazy, Suspense, useEffect, StrictMode } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import CssBaseline from "@mui/material/CssBaseline";
import { CircularProgress, Box } from "@mui/material";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import { CacheProvider } from "@emotion/react";
import { TssCacheProvider } from "tss-react";
import AppThemeProvider from "./_core/materialUIThemeProvider/ThemeProvider";
import createCache from "@emotion/cache";
import { initReveal } from "./_core/APP/Global/reveal";

const Home = lazy(() => import("./pages/Home"));
const Resume = lazy(() => import("./pages/Resume"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Contact = lazy(() => import("./pages/Contact"));

const muiCache = createCache({
  key: "mui",
  prepend: true,
});

const tssCache = createCache({
  key: "tss",
});

const PageFallback = () => (
  <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
    <CircularProgress />
  </Box>
);

const App = ({ basename }) => {
  useEffect(() => initReveal(), []);

  return (
    <StrictMode>
      <CssBaseline />
      <Router basename={basename}>
        <ScrollToTop />
        <CacheProvider value={muiCache}>
          <TssCacheProvider value={tssCache}>
            <AppThemeProvider>
              <Layout>
                <Suspense fallback={<PageFallback />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/resume" element={<Resume />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/contact" element={<Contact />} />
                  </Routes>
                </Suspense>
              </Layout>
            </AppThemeProvider>
          </TssCacheProvider>
        </CacheProvider>
      </Router>
    </StrictMode>
  );
};

export default App;
