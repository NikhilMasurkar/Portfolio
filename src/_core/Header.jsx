import React from "react";
import { Link, useLocation } from "react-router";
import Container from "../app/widgets/Container.jsx";
import MobileNav from "./MobileNav.jsx";
import { ROUTE_PATH } from "../app/global/RoutePath.js";
import { NAV_ITEMS, isActivePath } from "../app/global/nav.js";

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line-header bg-bg/70 backdrop-blur-[18px]">
      <Container className="flex h-header items-center justify-between gap-8">
        <Link
          to={ROUTE_PATH.HOME}
          className="font-display text-2xl font-bold tracking-tight text-fg"
        >
          NM<span className="text-accent-text">.</span>
        </Link>

        <nav aria-label="Main" className="hidden min-[720px]:block">
          <ul className="flex flex-wrap items-center gap-x-[34px] gap-y-3">
            {NAV_ITEMS.filter((item) => item.href !== ROUTE_PATH.RESUME).map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
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

        <div className="flex items-center gap-3">
          {/*
            Resume is a button rather than a nav item, per the design. It is
            filtered out of the list above so it does not appear twice — but
            only rendered at all once the page exists, like every other route.
          */}
          {ROUTE_PATH.RESUME && (
            <Link
              to={ROUTE_PATH.RESUME}
              className="hidden rounded-full bg-[image:var(--gradient-04)] px-5 py-2 text-[14px] font-semibold text-fg shadow-cta transition-transform hover:-translate-y-0.5 min-[720px]:inline-flex"
            >
              Resume
            </Link>
          )}

          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
