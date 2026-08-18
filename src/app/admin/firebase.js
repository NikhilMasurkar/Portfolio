import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Firebase client, for the admin panel only.
 *
 * Deliberately inside src/app/admin/ so it is reachable only from the lazily
 * loaded admin chunk. The Firebase SDK is large and the public site has no use
 * for it — the server reads Firestore over REST, and visitors read nothing.
 * Importing this from a public page would put the whole SDK in the bundle
 * every visitor downloads.
 *
 * These values are public by design. They identify the project; they do not
 * grant access. What may be written is decided by firestore.rules.
 */
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/** Missing config produces a confusing SDK error; say what is actually wrong. */
export function configError() {
  const missing = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => `VITE_FIREBASE_${key.replace(/[A-Z]/g, (c) => `_${c}`).toUpperCase()}`);
  return missing.length ? `Missing Firebase config: ${missing.join(", ")}` : null;
}

// getApps() guard: Vite's HMR re-runs this module, and initializeApp throws on
// a duplicate app name.
const app = getApps().length ? getApps()[0] : initializeApp(config);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
