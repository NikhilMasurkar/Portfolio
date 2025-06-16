import React, { lazy, StrictMode } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import CssBaseline from "@mui/material/CssBaseline";
import Layout from "./components/Layout";
import AOS from "aos";
import "aos/dist/aos.css";
import ScrollToTop from "./components/ScrollToTop";
import { CacheProvider } from "@emotion/react";
import { TssCacheProvider } from "tss-react";
import AppThemeProvider from "./_core/materialUIThemeProvider/ThemeProvider";
import createCache from "@emotion/cache";

// Initialize AOS animation library
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

const App = ({ basename }) => {
  React.useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <StrictMode>
      <CssBaseline />
      <Router basename={basename}>
        <ScrollToTop />
        <CacheProvider value={muiCache}>
          <TssCacheProvider value={tssCache}>
            <AppThemeProvider>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/resume" element={<Resume />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </Layout>
            </AppThemeProvider>
          </TssCacheProvider>
        </CacheProvider>
      </Router>
    </StrictMode>
  );
};

export default App;
