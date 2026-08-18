import React, { useState } from "react";
import { Alert, Box, Button, Paper, Stack, Typography } from "@mui/material";
import { seedContent } from "../../admin/seed.js";

/**
 * Admin landing screen.
 *
 * The seed lives here because it is the one operation with no other route:
 * writes require an authenticated admin, and this project has no service
 * account by design, so a headless script cannot authenticate at all.
 */
export default function Overview() {
  const [state, setState] = useState({ status: "idle", lines: [] });

  async function runSeed() {
    setState({ status: "running", lines: ["Starting…"] });
    try {
      const lines = await seedContent((line) =>
        setState((prev) => ({ ...prev, lines: [...prev.lines, line] }))
      );
      setState({ status: "done", lines });
    } catch (error) {
      setState((prev) => ({
        status: "error",
        lines: [...prev.lines, `Failed: ${error.message}`],
      }));
    }
  }

  return (
    <Stack spacing={4}>
      <Alert severity="info">
        Content edits appear on the public site within 60 seconds. That is the
        server&apos;s content cache expiring — not a deploy, and nothing needs
        rebuilding.
      </Alert>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h3" sx={{ fontSize: 20, mb: 1 }}>
          Seed content
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 640 }}>
          Writes the profile, projects, experience and skills carried over from
          the previous build. Safe to run again — each document has a fixed id,
          so a repeat overwrites rather than duplicating. It will overwrite
          anything you have edited since, though.
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 2.5 }}
          onClick={runSeed}
          disabled={state.status === "running"}
        >
          {state.status === "running" ? "Seeding…" : "Run seed"}
        </Button>

        {state.lines.length > 0 && (
          <Box
            component="pre"
            sx={{
              mt: 3,
              p: 2,
              maxHeight: 320,
              overflow: "auto",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.default",
              fontSize: 12,
              lineHeight: 1.7,
              color: state.status === "error" ? "error.main" : "text.secondary",
            }}
          >
            {state.lines.join("\n")}
          </Box>
        )}
      </Paper>
    </Stack>
  );
}
