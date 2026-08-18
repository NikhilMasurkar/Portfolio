import { initializeApp, getApps } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  indexedDBLocalPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
  browserPopupRedirectResolver,
  GoogleAuthProvider,
} from "firebase/auth";
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

/**
 * Persistence is declared as a fallback chain rather than left to getAuth().
 *
 * getAuth() commits to IndexedDB, and when that store is unavailable the SDK
 * fails with "Database is closing/hidden" instead of degrading. IndexedDB is
 * genuinely absent or unreliable in more places than it sounds: private
 * windows, Safari and Brave with strict storage settings, browsers evicting
 * storage for a backgrounded tab, and profiles where site data is blocked.
 *
 * Firebase walks this list in order and uses the first that works. The last
 * entry cannot fail — an in-memory session lasts only until the tab closes,
 * which for an admin panel is a mild annoyance rather than a broken login.
 *
 * getAuth() is the fallback path here only for Vite HMR, where initializeAuth
 * throws on a second call for the same app.
 */
function createAuth() {
  try {
    return initializeAuth(app, {
      persistence: [
        indexedDBLocalPersistence,
        browserLocalPersistence,
        browserSessionPersistence,
        inMemoryPersistence,
      ],
      popupRedirectResolver: browserPopupRedirectResolver,
    });
  } catch {
    return getAuth(app);
  }
}

export const auth = createAuth();
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
// Always ask which account. Without this, a browser holding several Google
// sessions silently picks one, which is confusing when it picks the wrong one.
googleProvider.setCustomParameters({ prompt: "select_account" });
