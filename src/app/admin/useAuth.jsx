import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as fbSignOut,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase.js";

/**
 * Admin session.
 *
 * The allowlist here is a UX guard, not the security boundary. Firestore rules
 * are what actually stop a write, and they must, because anyone can sign in
 * with any Google account and open a browser console. This exists so the wrong
 * account gets told why it cannot proceed rather than watching every save fail
 * with a permissions error.
 */

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "nikhildmasurkar@gmail.com";

const AuthContext = createContext(null);

/**
 * Turn a Firebase error into something that says what to do about it.
 *
 * The raw `message` alone is what made "Database is closing/hidden" so
 * unhelpful: it names a symptom deep inside the SDK's storage layer and says
 * nothing about the cause. The `code` is the part worth acting on, so it is
 * always shown.
 */
function describe(error) {
  const code = error?.code ?? "unknown";
  const message = error?.message ?? String(error);

  if (code === "auth/unauthorized-domain") {
    return `[${code}] This origin is not authorised. Add ${window.location.hostname} under Firebase → Authentication → Settings → Authorized domains. Note that 127.0.0.1 and localhost count as different domains.`;
  }

  if (code === "auth/popup-blocked") {
    return `[${code}] Your browser blocked the popup. Use the redirect option below.`;
  }

  // The storage-layer failures. IndexedDB is unavailable, and the popup flow
  // needs somewhere to persist state across the round trip.
  if (
    code === "auth/internal-error" ||
    code === "auth/web-storage-unsupported" ||
    /database|indexeddb|storage/i.test(message)
  ) {
    return `[${code}] ${message} — this is browser storage being unavailable, not a credentials problem. It usually means a private window, or site data blocked for this origin. Try the redirect option below, or a normal window with cookies allowed.`;
  }

  return `[${code}] ${message}`;
}

function isRecoverableWithRedirect(error) {
  const code = error?.code ?? "";
  const message = error?.message ?? String(error);
  return (
    !code ||
    code === "auth/popup-blocked" ||
    code === "auth/internal-error" ||
    code === "auth/operation-not-supported-in-this-environment" ||
    code === "auth/web-storage-unsupported" ||
    /database|indexeddb|storage/i.test(message)
  );
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    return onAuthStateChanged(
      auth,
      (nextUser) => {
        setUser(nextUser);
        setLoading(false);
      },
      (authError) => {
        setError(authError.message);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    getRedirectResult(auth).catch((redirectError) => {
      setError(describe(redirectError));
    });
  }, []);

  async function signIn() {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (popupError) {
      if (popupError.code === "auth/popup-closed-by-user") return;
      if (popupError.code === "auth/cancelled-popup-request") return;


      if (isRecoverableWithRedirect(popupError)) {
        await signInRedirect();
        return;
      }

      setError(describe(popupError));
    }
  }

  async function signInRedirect() {
    setError(null);
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (redirectError) {
      setError(describe(redirectError));
    }
  }

  const signOut = () => fbSignOut(auth);

  const isAdmin = Boolean(
    user && user.email === ADMIN_EMAIL && user.emailVerified
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        error,
        signIn,
        signInRedirect,
        signOut,
        adminEmail: ADMIN_EMAIL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth() must be used inside <AuthProvider>");
  return value;
}
