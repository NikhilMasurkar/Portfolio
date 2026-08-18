import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { adminTheme } from "./app/admin/theme.js";
import Admin from "./app/pages/admin/Admin.jsx";
import Overview from "./app/pages/admin/Overview.jsx";
import ProfileEditor from "./app/pages/admin/ProfileEditor.jsx";
import ResumeEditor from "./app/pages/admin/ResumeEditor.jsx";
import ProjectsEditor from "./app/pages/admin/ProjectsEditor.jsx";
import PostsEditor from "./app/pages/admin/PostsEditor.jsx";
import { ExperienceEditor, EducationEditor } from "./app/pages/admin/sections.jsx";
import ResumeInlineEditor from "./app/pages/admin/ResumeInlineEditor.jsx";

/**
 * The admin panel's own root, separate from the public App.
 *
 * Kept apart deliberately:
 *
 *  - It is never server-rendered, so it is mounted with createRoot rather than
 *    hydrated. Sharing a tree with the public site would mean matching the
 *    server's markup for a page the server does not render.
 *  - Everything it imports — the Firebase SDK, MUI, Emotion — stays in a chunk
 *    that only loads at /admin. The public bundle never carries it.
 *
 * This is also the only place MUI's ThemeProvider and CssBaseline appear.
 * On the public side Tailwind does that job; see the note in src/App.jsx.
 */
export default function AdminApp() {
  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route
            path="/admin"
            element={
              <Admin title="Overview">
                <Overview />
              </Admin>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <Admin title="Profile">
                <ProfileEditor />
              </Admin>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <Admin title="Projects">
                <ProjectsEditor />
              </Admin>
            }
          />
          <Route
            path="/admin/posts"
            element={
              <Admin title="Blog posts">
                <PostsEditor />
              </Admin>
            }
          />
          <Route
            path="/admin/resume"
            element={
              <Admin title="Resume">
                <ResumeEditor />
              </Admin>
            }
          />
          <Route
            path="/admin/experience"
            element={
              <Admin title="Experience">
                <ExperienceEditor />
              </Admin>
            }
          />
          <Route
            path="/admin/education"
            element={
              <Admin title="Education">
                <EducationEditor />
              </Admin>
            }
          />

          {/*
            Outside /admin because it is the resume page with editing switched
            on, not a form about the resume. Same auth gate either way.
          */}
          <Route
            path="/resume/edit"
            element={
              <Admin title="Edit resume">
                <ResumeInlineEditor />
              </Admin>
            }
          />

          {/* Anything deeper is a section not built yet — show the overview
              rather than a blank screen. */}
          <Route
            path="/admin/*"
            element={
              <Admin title="Overview">
                <Overview />
              </Admin>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
