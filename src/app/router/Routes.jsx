import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router";
import Layout from "../../_core/Layout";
import { ROUTES, REDIRECT_ROUTES, assertRoutesResolvable } from "./routeTable";

/**
 * Browser pages: lazy, so each is a separate chunk.
 * Paths come from routeTable.js — shared with the server.
 */
const components = {
  Home: lazy(() => import("../pages/home/Home")),
};

const NotFound = lazy(() => import("../pages/error/NotFound"));

assertRoutesResolvable(components, "src/app/router/Routes.jsx");

export function PageRoutes() {
  return (
    <Layout>
      {/* MUST MATCH server/ServerRoutes.jsx — see the note there. */}
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
