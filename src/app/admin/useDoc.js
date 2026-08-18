import { useEffect, useState } from "react";
import { doc, getDoc, getDocs, collection as coll } from "firebase/firestore";
import { db } from "./firebase.js";

/**
 * Loads a whole collection for editing, ordered by `order`.
 *
 * Unfiltered, unlike the public site: the admin sees drafts and unpublished
 * rows, which is exactly what firestore.rules permits for the admin account
 * and refuses for everyone else.
 */
export function useCollection(name, reloadKey = 0) {
  const [state, setState] = useState({ loading: true, rows: [], error: null });

  useEffect(() => {
    let cancelled = false;

    getDocs(coll(db, name))
      .then((snapshot) => {
        if (cancelled) return;
        const rows = snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setState({ loading: false, rows, error: null });
      })
      .catch((error) => {
        if (!cancelled) setState({ loading: false, rows: [], error });
      });

    return () => {
      cancelled = true;
    };
  }, [name, reloadKey]);

  return state;
}

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
