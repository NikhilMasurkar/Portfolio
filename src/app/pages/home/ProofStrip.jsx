import React from "react";
import Container from "../../widgets/Container.jsx";
import Reveal from "../../widgets/Reveal.jsx";
import { useProfile } from "../../global/ContentContext.jsx";

/**
 * The metrics panel that bridges the hero into the page.
 *
 * Deliberately the calmest thing on the home page after the hero: it is a
 * single glass slab with no glow of its own, so the eye drops out of the hero
 * and settles before Featured Work reclaims it. Making this section loud too
 * would flatten the whole hierarchy.
 *
 * Every figure comes from Firestore. The design reference shows numbers like
 * "20+ Projects Completed" and "99.8% Crash Free Rate" — those are mockup
 * filler and are not shown here, because the brief's own rule is that a stat
 * has to be sourceable. Recruiters check.
 */
export default function ProofStrip() {
  const { clients, stats } = useProfile();

  // Before Firestore is seeded both are empty. Rendering the card anyway would
  // put an empty bordered box in the middle of the home page.
  if (clients.length === 0 && stats.length === 0) return null;

  return (
    <section className="pt-6">
      <Container>
        <Reveal className="surface overflow-hidden">
          {clients.length > 0 && (
            <div className="border-b border-line-inner px-8 py-7 max-[720px]:px-5">
              {/*
                "Worked with", not the reference's "Trusted by". These are
                employers rather than clients, and the distinction is
                load-bearing because it is checkable.
              */}
              <h2 className="eyebrow mb-6 text-center">Worked with</h2>

              <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
                {clients.map((client) => (
                  <li
                    key={client.name}
                    className="flex items-center gap-3 font-display text-[17px] font-semibold text-meta transition-colors hover:text-fg-3"
                  >
                    <span
                      aria-hidden
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-line-raised font-mono text-[10.5px] text-primary-text"
                    >
                      {client.mark}
                    </span>
                    {client.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {stats.length > 0 && (
            <dl className="grid grid-cols-5 gap-y-8 px-8 py-9 max-[1160px]:grid-cols-3 max-[720px]:grid-cols-2 max-[720px]:px-5">
              {stats.map((stat) => (
                <div key={stat.label} className="px-2 text-center">
                  {/* The number alone means nothing to a screen reader, so the
                      label is the term and the value its definition. */}
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="m-0">
                    <span className="block bg-[image:var(--gradient-01)] bg-clip-text font-display text-[36px] font-bold leading-none tracking-[-0.02em] text-transparent max-[720px]:text-[30px]">
                      {stat.value}
                    </span>
                    <span className="mt-2.5 block text-[12.5px] leading-snug text-meta">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
