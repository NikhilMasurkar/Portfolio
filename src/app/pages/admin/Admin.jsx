import React from "react";
import { Link, useLocation } from "react-router";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { AuthProvider, useAuth } from "../../admin/useAuth.jsx";
import { configError } from "../../admin/firebase.js";

/**
 * Admin gate and shell. Client-rendered only — server/index.js serves the bare
 * shell for /admin and never runs this, which keeps the Firebase SDK and MUI
 * out of the server bundle entirely.
 */

/** Sections that exist. Added here as each editor is built. */
const SECTIONS = [
  { label: "Overview", path: "/admin" },
  { label: "Profile", path: "/admin/profile" },
];

function Centered({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        p: 3,
      }}
    >
      <Paper sx={{ p: 5, maxWidth: 440, width: "100%", textAlign: "center" }}>
        {children}
      </Paper>
    </Box>
  );
}

function Shell({ title, children }) {
  const { user, signOut } = useAuth();
  const { pathname } = useLocation();

  // Exact match: "/admin" is a prefix of every other section, so a startsWith
  // check would light up Overview on every page.
  const active = SECTIONS.findIndex((section) => section.path === pathname);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Container maxWidth="lg" sx={{ pt: 4 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            flexWrap="wrap"
            gap={2}
          >
            <Box>
              <Typography variant="h1" sx={{ fontSize: 28 }}>
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
            <Button variant="outlined" size="small" onClick={signOut}>
              Sign out
            </Button>
          </Stack>

          <Tabs value={active === -1 ? false : active} sx={{ mt: 2 }}>
            {SECTIONS.map((section) => (
              <Tab
                key={section.path}
                label={section.label}
                component={Link}
                to={section.path}
              />
            ))}
          </Tabs>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        {children}
      </Container>
    </Box>
  );
}

function Gate({ title, children }) {
  const { user, isAdmin, loading, error, signIn, signInRedirect, signOut, adminEmail } =
    useAuth();

  if (loading) {
    return (
      <Centered>
        <Typography color="text.secondary">Checking your session…</Typography>
      </Centered>
    );
  }

  if (!user) {
    return (
      <Centered>
        <Typography variant="h1" sx={{ fontSize: 30, mb: 1 }}>
          Admin
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sign in to edit the content of this site.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 3, textAlign: "left" }}>
            {error}
          </Alert>
        )}

        <Button variant="contained" fullWidth sx={{ mt: 4 }} onClick={signIn}>
          Continue with Google
        </Button>

        {/*
          Offered permanently, not only after a failure. The popup needs
          storage the opener can read back, which browsers increasingly
          partition — this path does not.
        */}
        <Button size="small" fullWidth sx={{ mt: 1.5 }} onClick={signInRedirect}>
          Popup blocked? Sign in by redirect
        </Button>
      </Centered>
    );
  }

  if (!isAdmin) {
    /*
     * Signed in as the wrong account. Saying so plainly beats letting every
     * write fail against Firestore rules, which are the real enforcement and
     * cannot be talked out of.
     */
    return (
      <Centered>
        <Typography variant="h1" sx={{ fontSize: 24, mb: 1.5 }}>
          Not authorised
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You are signed in as {user.email}. This site can only be edited by{" "}
          {adminEmail}.
        </Typography>
        <Button variant="outlined" fullWidth sx={{ mt: 4 }} onClick={signOut}>
          Sign out
        </Button>
      </Centered>
    );
  }

  return <Shell title={title}>{children}</Shell>;
}

export default function Admin({ title, children }) {
  const problem = configError();

  if (problem) {
    // Without this the SDK throws something opaque about an invalid API key.
    return (
      <Centered>
        <Typography variant="h1" sx={{ fontSize: 24, mb: 1.5 }}>
          Not configured
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {problem}
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ display: "block", mt: 2 }}>
          Set these in .env locally, and in Netlify under Site settings →
          Environment variables.
        </Typography>
      </Centered>
    );
  }

  return (
    <AuthProvider>
      <Gate title={title}>{children}</Gate>
    </AuthProvider>
  );
}
