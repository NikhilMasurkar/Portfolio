import React, { useEffect, useRef, useSyncExternalStore } from "react";

/**
 * A looping background clip, loaded only where it is actually wanted.
 *
 * The still image underneath is always rendered and is never replaced — the
 * video sits on top of it. So the section looks finished before a single byte
 * of video arrives, and looks identical to anyone who never gets it.
 *
 * Three conditions have to hold before it loads at all:
 *
 *   - a viewport wide enough to be a laptop. A phone should not spend 250KB
 *     and decode budget on decoration.
 *   - prefers-reduced-motion not set. Continuous background motion is exactly
 *     what that setting exists to stop, and for some people it causes real
 *     nausea rather than mild annoyance.
 *   - Save-Data not requested. Someone who has asked the browser to conserve
 *     data has said what they want.
 *
 * Read through useSyncExternalStore rather than an effect: it returns false on
 * the server, so SSR emits no <video> at all and hydration matches — an effect
 * would render one, then remove it, which is a flash and a wasted request.
 */

const QUERY = "(min-width: 900px)";
const REDUCED = "(prefers-reduced-motion: reduce)";

function subscribe(callback) {
  const wide = window.matchMedia(QUERY);
  const reduced = window.matchMedia(REDUCED);
  wide.addEventListener("change", callback);
  reduced.addEventListener("change", callback);
  return () => {
    wide.removeEventListener("change", callback);
    reduced.removeEventListener("change", callback);
  };
}

function getSnapshot() {
  if (navigator.connection?.saveData) return false;
  return (
    window.matchMedia(QUERY).matches && !window.matchMedia(REDUCED).matches
  );
}

/** The server has no viewport and no preferences, so it never renders one. */
const getServerSnapshot = () => false;

export default function BackgroundVideo({ mp4, webm, className = "", style }) {
  const shouldPlay = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ref = useRef(null);

  /*
   * Nudge playback when the tab becomes visible again.
   *
   * A tab that loads in the background does not decode video, and autoplay
   * there resolves without ever starting — observed directly: play() resolved
   * while paused stayed true and currentTime never moved. Browsers usually
   * pick it up on their own when the tab is shown, but "usually" leaves a
   * frozen frame where a moving background should be, and the still behind it
   * is identical so nothing would look obviously wrong to report.
   *
   * Cheap insurance: a paused video is asked once more when it can actually
   * play. The rejection is swallowed because a background decoration failing
   * to start is not worth a console error.
   */
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible" && ref.current?.paused) {
        ref.current.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [shouldPlay]);

  if (!shouldPlay) return null;

  return (
    <video
      ref={ref}
      className={className}
      style={style}
      // autoPlay only works muted, and a background clip must be silent
      // regardless. playsInline stops iOS taking it fullscreen.
      autoPlay
      muted
      loop
      playsInline
      // No poster: the still image is already painted underneath, so a poster
      // would just be the same bytes fetched twice.
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
    >
      {/* WebM first — smaller where it is supported, with MP4 as the fallback
          rather than the other way round. */}
      {webm && <source src={webm} type="video/webm" />}
      {mp4 && <source src={mp4} type="video/mp4" />}
    </video>
  );
}
