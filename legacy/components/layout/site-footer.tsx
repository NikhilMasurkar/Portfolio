import Link from "next/link";
import { Container } from "@/components/ui/container";
import { navItems } from "@/lib/nav";
import { siteConfig } from "@/lib/site-config";
import { socials } from "@/lib/socials";

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-line-header bg-surface/60">
      <Container className="flex flex-wrap items-center justify-between gap-8 py-8 max-[720px]:flex-col max-[720px]:items-start">
        <div>
          <div className="mb-1.5 font-display text-xl font-bold tracking-tight">
            NM<span className="text-accent-text">.</span>
          </div>
          <p className="text-[12.5px] leading-relaxed text-dim">
            © {new Date().getFullYear()} {siteConfig.name}.
            <br />
            All rights reserved.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[13px] text-meta transition-colors hover:text-fg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="flex gap-2.5">
          {socials.map((social) => (
            <li key={social.name}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-line font-mono text-[11px] text-meta transition-colors hover:border-primary hover:text-fg"
              >
                <span aria-hidden>{social.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}
