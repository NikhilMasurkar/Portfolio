import React, { useState } from "react";
import { useAuth } from "../../admin/useAuth.jsx";
import { seedContent } from "../../admin/seed.js";

/**
 * Signed-in admin landing screen.
 *
 * The editors arrive in P4. What is here now is the one thing that cannot be
 * done any other way: seeding Firestore. Writes require an authenticated
 * admin, and this project has no service account by design — so the seed runs
 * from the browser, in a session that is already the admin, rather than from
 * a script holding a credential.
 */
export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [state, setState] = useState({ status: "idle", lines: [] });

  async function runSeed() {
    setState({ status: "running", lines: ["Starting…"] });
    try {
      const lines = await seedContent((line) =>
        setState((prev) => ({ ...prev, lines: [...prev.lines, line] }))
      );
      setState({ status: "done", lines });
    } catch (error) {
      setState((prev) => ({
        status: "error",
        lines: [...prev.lines, `Failed: ${error.message}`],
      }));
    }
  }

  return (
    <div className="min-h-screen bg-bg px-6 py-16">
      <div className="mx-auto w-full max-w-3xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-fg">Admin</h1>
            <p className="mt-1 text-sm text-meta">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="rounded-xl border border-line-raised px-5 py-2.5 text-sm font-semibold text-fg transition-colors hover:border-primary"
          >
            Sign out
          </button>
        </header>

        <section className="mt-10 rounded-[22px] border border-line bg-surface p-8">
          <h2 className="font-display text-xl font-semibold text-fg">
            Seed content
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Writes the profile, projects, experience, education and skills from
            the previous build into Firestore. Safe to run more than once — each
            document is written by a fixed id, so a repeat overwrites rather
            than duplicating.
          </p>

          <button
            type="button"
            onClick={runSeed}
            disabled={state.status === "running"}
            className="mt-6 rounded-xl bg-[image:var(--gradient-04)] px-6 py-3 text-[15px] font-semibold text-fg shadow-cta transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {state.status === "running" ? "Seeding…" : "Run seed"}
          </button>

          {state.lines.length > 0 && (
            <pre
              className={`mt-6 max-h-80 overflow-auto rounded-xl border p-4 font-mono text-[12px] leading-relaxed ${
                state.status === "error"
                  ? "border-line-raised bg-bg text-fg-3"
                  : "border-line-inner bg-bg text-meta"
              }`}
            >
              {state.lines.join("\n")}
            </pre>
          )}

          {state.status === "done" && (
            <p className="mt-4 text-sm text-secondary">
              Done. The public site picks this up within 60 seconds — that is
              the content cache TTL, not a deploy.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
