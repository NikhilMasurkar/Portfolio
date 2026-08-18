import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router";
import Layout from "../../_core/Layout";
import { ROUTES, REDIRECT_ROUTES, assertRoutesResolvable } from "./routeTable";

/**
 * Browser pages: lazy, so each is a separate chunk.
 * Paths come from routeTable.js — shared with the server.
 */
const components = {
  Home: lazy(() => import("../pages/home/Home.jsx")),
  About: lazy(() => import("../pages/about/About.jsx")),
  Projects: lazy(() => import("../pages/projects/Projects.jsx")),
  ProjectDetail: lazy(() => import("../pages/projects/ProjectDetail.jsx")),
  Blog: lazy(() => import("../pages/blog/Blog.jsx")),
  BlogPost: lazy(() => import("../pages/blog/BlogPost.jsx")),
  Resume: lazy(() => import("../pages/resume/Resume.jsx")),
  Contact: lazy(() => import("../pages/contact/Contact.jsx")),
};

const NotFound = lazy(() => import("../pages/error/NotFound.jsx"));

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
