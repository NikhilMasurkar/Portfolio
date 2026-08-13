import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionBackground } from "@/components/ui/section-background";

export function ContactCta() {
  return (
    <section className="relative overflow-hidden pb-28 pt-4">
      <SectionBackground variant="contact" />
      <Container>
        <Reveal className="rounded-[22px] border border-line bg-surface/85 px-8 py-14 text-center">
          <h2 className="m-0 mb-4 font-display text-[46px] font-bold leading-[1.2] tracking-[-0.03em] max-[720px]:text-[32px]">
            Let&apos;s Build Something
            <br />
            <span className="bg-[image:var(--gradient-01)] bg-clip-text text-transparent">
              Amazing Together.
            </span>
          </h2>
          <p className="mx-auto mb-9 max-w-[420px] text-base leading-[1.75] text-muted">
            I&apos;m currently available for freelance work and full-time
            opportunities.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2.5 rounded-xl bg-[image:var(--gradient-04)] px-8 py-4 text-[15px] font-semibold text-fg shadow-cta transition-transform hover:-translate-y-0.5"
          >
            Get In Touch <span aria-hidden>→</span>
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
