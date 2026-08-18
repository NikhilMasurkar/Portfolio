import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
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

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fires immediately with the persisted session, so a refresh does not
    // bounce a signed-in admin back to the login screen.
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

  async function signIn() {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (popupError) {
      // Closing the popup is a normal thing to do, not something to report.
      if (popupError.code === "auth/popup-closed-by-user") return;
      if (popupError.code === "auth/unauthorized-domain") {
        setError(
          `This domain is not authorised in Firebase. Add ${window.location.hostname} under Authentication → Settings → Authorized domains.`
        );
        return;
      }
      setError(popupError.message);
    }
  }

  const signOut = () => fbSignOut(auth);

  const isAdmin = Boolean(
    user && user.email === ADMIN_EMAIL && user.emailVerified
  );

  return (
    <AuthContext.Provider
      value={{ user, isAdmin, loading, error, signIn, signOut, adminEmail: ADMIN_EMAIL }}
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
