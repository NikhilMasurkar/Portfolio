import React from "react";
import { AuthProvider, useAuth } from "../../admin/useAuth.jsx";
import { configError } from "../../admin/firebase.js";
import Dashboard from "./Dashboard.jsx";

/**
 * Admin entry point. Client-rendered only — server/index.js serves the bare
 * shell for /admin and never runs this on the server, which keeps the Firebase
 * SDK out of the server bundle entirely.
 *
 * Styled with Tailwind rather than MUI. MUI is the right tool for the CRUD
 * screens (data grids, dialogs, form fields) and will be added when those land;
 * pulling in a large component library for a single sign-in button would not
 * earn its place.
 */

function Panel({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="w-full max-w-md rounded-[22px] border border-line bg-surface p-10 text-center">
        {children}
      </div>
    </div>
  );
}

function AdminGate() {
  const { user, isAdmin, loading, error, signIn, signOut, adminEmail } = useAuth();

  if (loading) {
    return (
      <Panel>
        <p className="text-muted">Checking your session…</p>
      </Panel>
    );
  }

  if (!user) {
    return (
      <Panel>
        <h1 className="font-display text-3xl font-bold text-fg">Admin</h1>
        <p className="mt-3 text-sm text-muted">
          Sign in to edit the content of this site.
        </p>

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-line-raised bg-bg px-4 py-3 text-left text-[13px] leading-relaxed text-fg-3"
          >
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={signIn}
          className="mt-8 w-full rounded-xl bg-[image:var(--gradient-04)] px-6 py-3.5 text-[15px] font-semibold text-fg shadow-cta transition-transform hover:-translate-y-0.5"
        >
          Continue with Google
        </button>
      </Panel>
    );
  }

  if (!isAdmin) {
    /*
     * Signed in as the wrong account. Saying so plainly beats letting every
     * write fail with a permissions error from Firestore, which is the actual
     * enforcement and cannot be talked out of.
     */
    return (
      <Panel>
        <h1 className="font-display text-2xl font-bold text-fg">Not authorised</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          You are signed in as <span className="text-fg-3">{user.email}</span>.
          This site can only be edited by <span className="text-fg-3">{adminEmail}</span>.
        </p>
        <button
          type="button"
          onClick={signOut}
          className="mt-8 w-full rounded-xl border border-line-raised px-6 py-3 text-sm font-semibold text-fg transition-colors hover:border-primary"
        >
          Sign out
        </button>
      </Panel>
    );
  }

  return <Dashboard />;
}

export default function Admin() {
  const problem = configError();

  if (problem) {
    // Without this the SDK throws something opaque about an invalid API key.
    return (
      <Panel>
        <h1 className="font-display text-2xl font-bold text-fg">Not configured</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">{problem}</p>
        <p className="mt-3 text-[13px] leading-relaxed text-meta">
          Set these in <code className="font-mono">.env</code> locally, and in
          Netlify under Site settings → Environment variables.
        </p>
      </Panel>
    );
  }

  return (
    <AuthProvider>
      <AdminGate />
    </AuthProvider>
  );
}
