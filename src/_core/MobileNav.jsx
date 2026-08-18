import React, { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { NAV_ITEMS, isActivePath } from "../app/global/nav.js";

const TRANSITION_MS = 250;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function MobileNav() {
  const { pathname } = useLocation();
  const dialogId = useId();
  const dialogRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [entered, setEntered] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  /*
   * Close on navigation. Back/forward and link clicks both change pathname,
   * so watching it — rather than only the link's onClick — covers every route
   * change.
   *
   * Adjusted during render rather than in an effect: React re-runs this
   * component before touching the DOM, so the drawer never paints open on the
   * new page. An effect would close it one commit later, which is a visible
   * flash and a cascading render.
   */
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Secondary safety net only. Some paths never fire `close`, so this must not
  // be the only thing clearing `open`; onCancel below is the real Escape path.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleNativeClose = () => setOpen(false);
    dialog.addEventListener("close", handleNativeClose);
    return () => dialog.removeEventListener("close", handleNativeClose);
  }, []);

  // Scroll lock lives in its own effect keyed only on `open`, so its cleanup
  // restores overflow on every path that ends `open` — including unmount —
  // whatever the dialog's own native state is doing.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
      const raf = requestAnimationFrame(() => setEntered(true));
      return () => cancelAnimationFrame(raf);
    }

    if (!dialog.open) return;

    // Closing: drop `entered` to run the exit transition, then close the
    // dialog once it has played. Deferred a frame so it is not a synchronous
    // setState inside the effect, which would cascade an extra render.
    const raf = requestAnimationFrame(() => setEntered(false));
    const delay = prefersReducedMotion() ? 0 : TRANSITION_MS;
    const timer = setTimeout(() => dialog.close(), delay);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls={dialogId}
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center text-fg min-[720px]:hidden"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
          <path
            d="M4 6h16M4 12h16M4 18h16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <dialog
        id={dialogId}
        ref={dialogRef}
        aria-label="Main menu"
        onCancel={(event) => {
          // Escape fires `cancel` before the browser closes the dialog itself.
          // Preventing that and routing through setOpen means Escape runs the
          // same exit transition and cleanup as every other close path.
          event.preventDefault();
          setOpen(false);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
        className="m-0 h-dvh max-h-none w-full max-w-none border-0 bg-transparent p-0 backdrop:bg-black/50"
      >
        <div
          className={`ml-auto flex h-full w-[min(320px,85vw)] flex-col gap-8 border-l border-line bg-surface px-8 py-6 transition-transform duration-[250ms] motion-reduce:transition-none ${
            entered ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-lg font-bold text-fg">Menu</span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center text-fg"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <ul className="flex flex-col gap-6">
            {NAV_ITEMS.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={`block py-2 text-lg font-medium ${active ? "text-fg" : "text-muted"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </dialog>
    </>
  );
}
