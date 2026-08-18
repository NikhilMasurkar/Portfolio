import { useState } from "react";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase.js";

/**
 * Save and delete against Firestore, with the status every editor needs.
 *
 * Writes go from the browser straight to Firestore — firestore.rules is the
 * enforcement, so there is no API to route through. What this adds is uniform
 * feedback: a save that silently does nothing is indistinguishable from one
 * that worked, and a permissions error from Firestore is worded for
 * developers, not for the person trying to edit their own site.
 */
export function useSave() {
  const [status, setStatus] = useState({ state: "idle", message: "" });

  async function run(action, successMessage) {
    setStatus({ state: "saving", message: "" });
    try {
      await action();
      setStatus({ state: "saved", message: successMessage });
      return true;
    } catch (error) {
      setStatus({
        state: "error",
        message:
          error?.code === "permission-denied"
            ? "Firestore refused the write. Check that you are signed in as the admin account."
            : error?.message || "Save failed.",
      });
      return false;
    }
  }

  return {
    status,
    dismiss: () => setStatus({ state: "idle", message: "" }),

    /** Whole-document write. `merge` keeps fields this form does not manage. */
    save: (collection, id, data, { merge = true } = {}) =>
      run(
        () => setDoc(doc(db, collection, id), data, { merge }),
        "Saved. The public site updates within 60 seconds."
      ),

    remove: (collection, id) =>
      run(() => deleteDoc(doc(db, collection, id)), "Deleted."),
  };
}
