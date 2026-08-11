// ponytail: replaces the `aos` package (unmaintained, 26KB of CSS, and it cached
// element offsets at init — before the lazy-loaded routes mounted — so content
// below the fold stayed at opacity 0 forever). IntersectionObserver has no
// offset cache to go stale. Same data-aos markup, so no page files changed.

const REVEALED = "aos-animate";

export function initReveal() {
  // Elements are only hidden once JS is live, so a script failure can never
  // leave the page blank again.
  document.documentElement.classList.add("reveal-ready");

  const io = new IntersectionObserver(
    (entries) => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        target.style.transitionDelay = `${target.dataset.aosDelay || 0}ms`;
        target.classList.add(REVEALED);
        io.unobserve(target);
      }
    },
    { rootMargin: "0px 0px -8% 0px" }
  );

  const scan = () => {
    for (const el of document.querySelectorAll(`[data-aos]:not(.${REVEALED})`)) {
      io.observe(el);
    }
  };

  scan();

  // Lazy routes mount after this runs; re-scan when the DOM changes. Coalesced
  // because MUI ripples mutate the DOM constantly.
  //
  // ponytail: setTimeout, NOT requestAnimationFrame. rAF is paused in a hidden
  // tab, which would leave this latch stuck and the page blank for anyone who
  // opens the site in a background tab.
  let queued = false;
  const mo = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    setTimeout(() => {
      queued = false;
      scan();
    }, 0);
  });
  mo.observe(document.body, { childList: true, subtree: true });

  return () => {
    io.disconnect();
    mo.disconnect();
    document.documentElement.classList.remove("reveal-ready");
  };
}
