import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionBackground } from "@/components/ui/section-background";
import { HeroArt } from "@/components/home/hero-art";
import { aboutSummary } from "@/data/about";
import { siteConfig } from "@/lib/site-config";
import { socials } from "@/lib/socials";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-0 pb-10 pt-24">
      <SectionBackground variant="hero" />
      <Container>
        <div className="grid grid-cols-[1.05fr_.95fr] items-center gap-16 max-[900px]:grid-cols-1">
          <div>
            <p className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/80 px-4 py-1.5 text-xs font-semibold tracking-[0.14em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_10px_var(--color-secondary)]" />
              HELLO, I&apos;M
            </p>

            <h1 className="m-0 font-display text-[76px] font-bold leading-[1.02] tracking-[-0.035em] max-[720px]:text-[44px]">
              {siteConfig.name}
            </h1>

            <p className="mb-1 bg-[image:var(--gradient-01)] bg-clip-text font-display text-[42px] font-semibold leading-tight tracking-[-0.02em] text-transparent max-[720px]:text-[28px]">
              {siteConfig.role}
            </p>

            <p className="mb-7 font-display text-[38px] font-medium leading-[1.2] tracking-[-0.02em] text-fg-2 max-[720px]:text-[24px]">
              {siteConfig.specialism}
            </p>

            <p className="mb-9 max-w-[480px] text-[16.5px] leading-[1.75] text-muted">
              {aboutSummary}
            </p>

            <div className="mb-11 flex flex-wrap gap-4">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2.5 rounded-xl bg-[image:var(--gradient-04)] px-7 py-4 text-[15px] font-semibold text-fg shadow-cta transition-transform hover:-translate-y-0.5"
              >
                Explore My Work <span aria-hidden>→</span>
              </Link>
              <Link
                href="/resume"
                className="inline-flex items-center gap-2.5 rounded-xl border border-line-raised bg-surface/70 px-7 py-4 text-[15px] font-semibold text-fg transition-colors hover:border-primary"
              >
                View Resume <span aria-hidden>↓</span>
              </Link>
            </div>

            <p className="mb-4 text-[11.5px] font-semibold tracking-[0.18em] text-dim">
              CONNECT WITH ME
            </p>
            <ul className="flex gap-3">
              {socials.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="flex h-11 w-11 items-center justify-center rounded-[11px] border border-line bg-surface/80 font-mono text-[13px] font-semibold text-muted transition-all hover:-translate-y-0.5 hover:border-primary hover:text-fg"
                  >
                    <span aria-hidden>{social.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <HeroArt />
        </div>
      </Container>
    </section>
  );
}
