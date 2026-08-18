import React from "react";
import Container from "../../widgets/Container.jsx";
import Reveal from "../../widgets/Reveal.jsx";
import { useProfile } from "../../global/ContentContext.jsx";

export default function ProofStrip() {
  const { clients, stats } = useProfile();

  // Before Firestore is seeded both are empty. Rendering the card anyway would
  // put an empty bordered box in the middle of the home page; a section with
  // no data should not exist.
  if (clients.length === 0 && stats.length === 0) return null;

  return (
    <section className="pt-5">
      <Container>
        <Reveal className="rounded-[22px] border border-line bg-surface/85 shadow-card">
          {clients.length > 0 && (
            <>
              {/*
                "Worked with", not "Trusted by". These are employers, not
                clients — the spec treats the distinction as load-bearing
                because recruiters verify it.
              */}
              <h2 className="px-8 pt-8 text-center text-[11.5px] font-semibold tracking-[0.2em] text-dim">
                WORKED WITH
              </h2>

              <ul className="grid grid-cols-2 gap-6 px-8 py-7">
                {clients.map((client) => (
                  <li
                    key={client.name}
                    className="flex items-center justify-center gap-3 font-display text-[19px] font-semibold text-meta"
                  >
                    <span
                      aria-hidden
                      className="flex h-6.5 w-6.5 items-center justify-center rounded-[7px] border border-line-raised p-1 font-mono text-[11px] text-primary-text"
                    >
                      {client.mark}
                    </span>
                    {client.name}
                  </li>
                ))}
              </ul>
            </>
          )}

          {stats.length > 0 && (
            <dl
              className={`grid grid-cols-5 px-8 py-8 max-[1160px]:grid-cols-3 max-[1160px]:gap-y-7 max-[720px]:grid-cols-2 ${
                clients.length > 0 ? "border-t border-line-inner" : ""
              }`}
            >
              {stats.map((stat) => (
                <div key={stat.label} className="px-2 text-center">
                  {/* The number alone is meaningless to a screen reader, so the
                      label is the term and the value its definition. */}
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="m-0">
                    <span className="block bg-[image:var(--gradient-01)] bg-clip-text font-display text-[34px] font-bold tracking-[-0.02em] text-transparent">
                      {stat.value}
                    </span>
                    <span className="mt-1.5 block text-[12.5px] text-meta">
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
