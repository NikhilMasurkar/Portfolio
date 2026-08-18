import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase.js";

/**
 * Loads one Firestore document for editing.
 *
 * Reads once rather than subscribing. A live subscription would overwrite what
 * is being typed the moment anything else touched the document — for a
 * single-author admin panel that is a hazard with no upside.
 */
export function useDoc(collection, id) {
  const [state, setState] = useState({ loading: true, data: null, error: null });

  useEffect(() => {
    let cancelled = false;

    getDoc(doc(db, collection, id))
      .then((snapshot) => {
        if (cancelled) return;
        setState({
          loading: false,
          // A missing document is a valid starting state, not an error — it is
          // what an unseeded collection looks like.
          data: snapshot.exists() ? snapshot.data() : null,
          error: null,
        });
      })
      .catch((error) => {
        if (!cancelled) setState({ loading: false, data: null, error });
      });

    return () => {
      cancelled = true;
    };
  }, [collection, id]);

  return state;
}
