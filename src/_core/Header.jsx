import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Container from "../app/widgets/Container.jsx";
import MobileNav from "./MobileNav.jsx";
import { ROUTE_PATH } from "../app/global/RoutePath.js";
import { NAV_ITEMS, isActivePath } from "../app/global/nav.js";

export default function Header() {
  const { pathname } = useLocation();

  /*
   * Transparent over the hero, glass once scrolled.
   *
   * The header sat on a permanent blur before, which fought the hero art
   * behind it and gave the page a hard band across the top before you had
   * scrolled anywhere. Starting transparent lets the hero run full-bleed and
   * makes the glass mean something: it appears when there is content to
   * separate from.
   *
   * Passive listener — this runs on every scroll frame and must never be able
   * to block it.
   */
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll(); // a reload partway down the page starts in the right state
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (

    <AppBar
      component="header"
      position="fixed"
      color="transparent"
      elevation={0}
      className={`z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${scrolled
        ? "border-b border-line-header bg-bg/72 backdrop-blur-[18px]"
        : "border-b border-transparent bg-transparent"
        }`}
    >
      <Container className="flex h-header items-center justify-between gap-8">
        <Link
          to={ROUTE_PATH.HOME}
          className="font-display text-2xl font-bold tracking-tight text-fg"
        >
          NM<Box component="span" className="text-accent-text">.</Box>
        </Link>

        <Box component="nav" aria-label="Main" className="hidden min-[720px]:block">
          <Stack
            component="ul"
            direction="row"
            className="flex flex-wrap items-center gap-x-[34px] gap-y-3"
          >
            {NAV_ITEMS.filter((item) => item.href !== ROUTE_PATH.RESUME).map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative py-2.5 text-[14.5px] font-medium transition-colors hover:text-fg ${active ? "text-fg" : "text-muted"
                      }`}
                  >
                    {item.label}
                    {active && (
                      <Box
                        component="span"
                        aria-hidden
                        className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-[image:var(--gradient-01)]"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </Stack>
        </Box>

        <Stack direction="row" className="items-center gap-3">

          {ROUTE_PATH.RESUME && (
            <Button
              component={Link}
              to={ROUTE_PATH.RESUME}
              className="btn btn-primary hidden !px-5 !py-2 !text-[14px] !rounded-full min-[720px]:inline-flex"
            >
              Resume
            </Button>
          )}

          <MobileNav />
        </Stack>
      </Container>
    </AppBar>
  );
}
