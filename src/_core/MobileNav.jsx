import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { NAV_ITEMS, isActivePath } from "../app/global/nav.js";


export default function MobileNav() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  /*
   * Close on navigation. Back/forward and link clicks both change pathname,
   * so watching it — rather than only the link's onClick — covers every route
   * change.
   *
   * Adjusted during render rather than in an effect: React re-runs this
   * component before touching the DOM, so the drawer never paints open on the
   * new page. An effect would close it one commit later, which is a visible
   * flash and a cascading render.
   */
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  return (
    <>
      <IconButton
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="h-9 w-9 text-fg min-[720px]:hidden"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
          <path
            d="M4 6h16M4 12h16M4 18h16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </IconButton>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        aria-label="Main menu"
        slotProps={{
          paper: {
            className:
              "flex h-full w-[min(320px,85vw)] flex-col gap-8 border-l border-line !bg-surface px-8 py-6",
          },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography className="font-display text-lg font-bold text-fg">Menu</Typography>
          <IconButton
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="h-9 w-9 text-fg"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </IconButton>
        </Stack>

        <Box component="ul" className="flex flex-col gap-6">
          {NAV_ITEMS.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`block py-2 text-lg font-medium ${active ? "text-fg" : "text-muted"}`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </Box>
      </Drawer>
    </>
  );
}
