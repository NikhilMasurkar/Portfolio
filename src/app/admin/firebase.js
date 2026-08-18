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
      /*
       * localStorage FIRST, ahead of IndexedDB.
       *
       * Firebase's own default prefers IndexedDB, and it selects it whenever
       * the API merely *exists* — not when it actually works. On a browser
       * where IndexedDB is present but its operations fail ("Database is
       * closing/hidden"), the session is written nowhere and the redirect
       * sign-in lands back on the login screen with no user.
       *
       * A Firebase session is a couple of KB, so IndexedDB's advantages are
       * irrelevant here while its failure modes are not. localStorage is
       * synchronous, far more widely reliable, and fails loudly if blocked.
       *
       * inMemory is last and cannot fail — but note it CANNOT survive a
       * redirect sign-in, because the redirect reloads the page. If the chain
       * ever falls that far, use the popup.
       */
      persistence: [
        browserLocalPersistence,
        indexedDBLocalPersistence,
        browserSessionPersistence,
        inMemoryPersistence,
      ],
      popupRedirectResolver: browserPopupRedirectResolver,
    });
  } catch {
    return getAuth(app);
  }
}

/**
 * What storage is actually usable, tested rather than feature-detected.
 *
 * Shown on the sign-in screen when something goes wrong. Firebase reports a
 * failure from deep inside its storage layer, which says nothing about which
 * mechanism is missing — this does.
 */
export function storageReport() {
  const report = { localStorage: false, indexedDB: false, cookies: false };

  try {
    const key = "__nm_probe__";
    window.localStorage.setItem(key, "1");
    report.localStorage = window.localStorage.getItem(key) === "1";
    window.localStorage.removeItem(key);
  } catch {
    report.localStorage = false;
  }

  try {
    report.indexedDB = typeof window.indexedDB !== "undefined";
  } catch {
    report.indexedDB = false;
  }

  report.cookies = navigator.cookieEnabled === true;
  return report;
}

export const auth = createAuth();
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
// Always ask which account. Without this, a browser holding several Google
// sessions silently picks one, which is confusing when it picks the wrong one.
googleProvider.setCustomParameters({ prompt: "select_account" });
