import React from "react";
import { StaticRouter, Routes, Route, Navigate } from "react-router";
import Layout from "../src/_core/Layout";
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
import NotFound from "../src/app/pages/error/NotFound.jsx";

const components = { Home };

// Throws at startup rather than serving a blank 200 for a route whose
// component was never added here.
assertRoutesResolvable(components, "server/ServerRoutes.jsx");

function ServerPageRoutes() {
  return (
    <Layout>
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
    </Layout>
  );
}

/** No Emotion CacheProvider — see the note in server/index.js. */
export default function ServerRoutes({ location }) {
  return (
    <StaticRouter location={location}>
      <ServerPageRoutes />
    </StaticRouter>
  );
}
