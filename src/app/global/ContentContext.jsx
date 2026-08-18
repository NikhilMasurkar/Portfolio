import React, { createContext, useContext } from "react";
import { FALLBACK_CONTENT } from "./fallbackContent.js";

/**
 * Firestore content, handed to components.
 *
 * The server fetches it once per render and passes it in; the client reads the
 * same object back from window.__CONTENT__. Both must see identical data or
 * hydration mismatches and React discards the server's markup — which would
 * throw away the entire point of SSR.
 */
const ContentContext = createContext(null);

export function ContentProvider({ content, children }) {
  return (
    <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
  );
}

export function useContent() {
  const content = useContext(ContentContext);

  if (!content) {
    /*
     * A missing provider is a wiring mistake, not a runtime condition. Falling
     * back rather than throwing is deliberate: a throw here reaches the SSR
     * catch, which serves the empty SPA shell — the failure this codebase
     * works hardest to avoid. The error log is what makes it loud instead.
     */
    console.error(
      "[content] useContent() called outside ContentProvider; using fallback"
    );
    return FALLBACK_CONTENT;
  }

  return content;
}

/** Convenience readers, so pages do not destructure the same fields everywhere. */
export const useProfile = () => useContent().profile;
export const useProjects = () => useContent().projects;
