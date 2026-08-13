"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/container";
import { MobileNav } from "@/components/layout/mobile-nav";
import { navItems } from "@/lib/nav";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line-header bg-bg/70 backdrop-blur-[18px]">
      <Container className="flex h-header items-center justify-between gap-8">
        <Link
          href="/"
          className="font-display text-2xl font-bold tracking-tight text-fg"
        >
          NM<span className="text-accent-text">.</span>
        </Link>

        <nav aria-label="Main" className="hidden min-[720px]:block">
          <ul className="flex flex-wrap items-center gap-x-[34px] gap-y-3">
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative py-1 text-[14.5px] font-medium transition-colors hover:text-fg ${
                      active ? "text-fg" : "text-muted"
                    }`}
                  >
                    {item.label}
                    {active && (
                      <span
                        aria-hidden
                        className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-[image:var(--gradient-01)]"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <MobileNav />
      </Container>
    </header>
  );
}
