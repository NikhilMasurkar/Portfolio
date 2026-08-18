import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Admin from "./app/pages/admin/Admin.jsx";

/**
 * The admin panel's own root, separate from the public App.
 *
 * Kept apart deliberately:
 *
 *  - It is never server-rendered, so it is mounted with createRoot rather than
 *    hydrated. Sharing a tree with the public site would mean matching the
 *    server's markup for a page the server does not render.
 *  - Everything it imports — the Firebase SDK, and MUI once the editors land —
 *    stays in a chunk that only loads at /admin. The public bundle never
 *    carries it.
 */
export default function AdminApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        {/* Sub-routes land in P4; until then anything deeper shows the
            dashboard rather than a blank screen. */}
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
