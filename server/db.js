/**
 * Firestore client for server-side reads.
 *
 * Returns null until credentials are configured, which is a supported state,
 * not an error: content.js treats a null db as "serve the fallback" and the
 * site renders with its identity intact and no dynamic content. That keeps
 * the whole SSR path buildable and testable before Firebase is connected.
 *
 * NOT YET WIRED. Key creation is blocked by an organisation policy on the
 * project (constraints/iam.disableServiceAccountKeyCreation), so the
 * credential shape is still undecided — service-account JSON, or the keyless
 * REST path governed by the same public-read rules. Whichever wins, it is
 * implemented here and nothing else changes.
 */

let client = null;
let warned = false;

export function getDb() {
  if (client) return client;

  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Once per process, not once per request — this runs on every render.
    if (!warned) {
      console.warn(
        "[db] Firestore not configured; serving fallback content. " +
          "Set FIREBASE_SERVICE_ACCOUNT to connect."
      );
      warned = true;
    }
    return null;
  }

  throw new Error(
    "[db] FIREBASE_SERVICE_ACCOUNT is set but the client is not implemented yet."
  );
}
