import React, { Suspense } from "react";
import { StaticRouter, Routes, Route, Navigate } from "react-router";
import Layout from "../src/_core/Layout";
import { ContentProvider } from "../src/app/global/ContentContext.jsx";
import {
  ROUTES,
  REDIRECT_ROUTES,
  assertRoutesResolvable,
} from "../src/app/router/routeTable";

/**
 * Server pages: EAGER imports with explicit .jsx extensions.
 *
 * renderToString() cannot resolve React.lazy() — it renders the Suspense
 * fallback, producing a blank #root. The extensions matter on a
 * case-insensitive filesystem, where "./home/Home" can resolve to home.json.
 */
import Home from "../src/app/pages/home/Home.jsx";
import About from "../src/app/pages/about/About.jsx";
import Projects from "../src/app/pages/projects/Projects.jsx";
import ProjectDetail from "../src/app/pages/projects/ProjectDetail.jsx";
import NotFound from "../src/app/pages/error/NotFound.jsx";

const components = { Home, About, Projects, ProjectDetail };

// Throws at startup rather than serving a blank 200 for a route whose
// component was never added here.
assertRoutesResolvable(components, "server/ServerRoutes.jsx");

function ServerPageRoutes() {
  return (
    <Layout>
      {/*
       * MUST MATCH src/app/router/Routes.jsx, boundary and fallback both.
       *
       * Nothing suspends here — these imports are eager — but a Suspense
       * boundary emits marker comments into the SSR output, so the client
       * cannot hydrate a boundary the server never opened. Omitting it makes
       * the trees structurally different and hydration fails at the first
       * child of <main>, which discards the entire server render.
       */}
      <Suspense fallback={<div style={{ minHeight: "60vh" }} />}>
        <Routes>
          {ROUTES.map(({ path, component }) => {
            const Page = components[component];
            return <Route key={path} path={path} element={<Page />} />;
          })}
          {REDIRECT_ROUTES.map(({ path, to }) => (
            <Route key={path} path={path} element={<Navigate to={to} replace />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

/** No Emotion CacheProvider — see the note in server/index.js. */
export default function ServerRoutes({ location, content }) {
  return (
    <ContentProvider content={content}>
      <StaticRouter location={location}>
        <ServerPageRoutes />
      </StaticRouter>
    </ContentProvider>
  );
}
