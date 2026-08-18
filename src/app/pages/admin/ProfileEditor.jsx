import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FileField from "./FileField.jsx";
import { useDoc } from "../../admin/useDoc.js";
import { useSave } from "../../admin/useSave.js";
import { profileSchema } from "../../global/schemas.js";
import { FALLBACK_PROFILE } from "../../global/fallbackContent.js";

/**
 * Everything in profile/main: identity, about copy, stats, socials, avatar and
 * the resume PDF.
 *
 * Validated against the same schema the server validates reads with, before
 * writing. Saving a document the site will refuse to render would show up only
 * as content silently disappearing — the error belongs here, next to the field
 * that caused it.
 */

/** Small helper for the repeated "list of objects" sections. */
function RowList({ title, rows, columns, onChange, blank }) {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        {title}
      </Typography>

      <Stack spacing={1.5}>
        {rows.map((row, index) => (
          <Stack key={index} direction="row" spacing={1.5} alignItems="center">
            {columns.map((column) => (
              <TextField
                key={column.key}
                label={column.label}
                value={row[column.key] ?? ""}
                sx={{ flex: column.flex ?? 1 }}
                onChange={(event) => {
                  const next = [...rows];
                  next[index] = { ...row, [column.key]: event.target.value };
                  onChange(next);
                }}
              />
            ))}
            <IconButton
              aria-label={`Remove ${title} row ${index + 1}`}
              onClick={() => onChange(rows.filter((_, i) => i !== index))}
            >
              ✕
            </IconButton>
          </Stack>
        ))}
      </Stack>

      <Button size="small" sx={{ mt: 1.5 }} onClick={() => onChange([...rows, blank])}>
        Add
      </Button>
    </Box>
  );
}

export default function ProfileEditor() {
  const { loading, data, error } = useDoc("profile", "main");
  const { status, save, dismiss } = useSave();
  const [form, setForm] = useState(null);
  const [invalid, setInvalid] = useState(null);
  const [loadedFrom, setLoadedFrom] = useState(undefined);

  /*
   * Seed the form from the loaded document, once.
   *
   * Adjusted during render rather than in an effect: an effect would paint an
   * empty form for one commit first, and re-running it on every render would
   * overwrite whatever is currently being typed. `data` is a stable reference
   * from useDoc, so this fires exactly once per load.
   *
   * Spread over the fallback so an unseeded profile still gets a usable form
   * rather than a page of undefined-valued inputs.
   */
  if (!loading && loadedFrom !== data) {
    setLoadedFrom(data);
    setForm({ ...FALLBACK_PROFILE, ...(data ?? {}) });
  }

  if (loading) return <Typography color="text.secondary">Loading…</Typography>;
  if (error) return <Alert severity="error">Could not load profile: {error.message}</Alert>;
  if (!form) return null;

  const set = (key) => (event) => setForm({ ...form, [key]: event.target.value });
  const setValue = (key) => (value) => setForm({ ...form, [key]: value });

  async function handleSave() {
    const result = profileSchema.safeParse(form);
    if (!result.success) {
      setInvalid(
        result.error.issues
          .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
          .join(" · ")
      );
      return;
    }
    setInvalid(null);
    await save("profile", "main", result.data);
  }

  return (
    <Stack spacing={4}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h3" sx={{ fontSize: 20, mb: 2.5 }}>
          Identity
        </Typography>
        <Stack spacing={2.5}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField label="Name" fullWidth value={form.name} onChange={set("name")} />
            <TextField label="Email" fullWidth value={form.email} onChange={set("email")} />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField label="Role" fullWidth value={form.role} onChange={set("role")} />
            <TextField
              label="Specialism"
              fullWidth
              value={form.specialism}
              onChange={set("specialism")}
            />
          </Stack>
          <TextField label="Tagline" fullWidth value={form.tagline} onChange={set("tagline")} />
          <TextField
            label="Meta description"
            helperText="Used as the fallback description in search results and link previews."
            fullWidth
            multiline
            minRows={2}
            value={form.description}
            onChange={set("description")}
          />
          <TextField
            label="Hero summary"
            helperText="The paragraph under your name on the home page."
            fullWidth
            multiline
            minRows={2}
            value={form.aboutSummary}
            onChange={set("aboutSummary")}
          />
        </Stack>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h3" sx={{ fontSize: 20, mb: 2.5 }}>
          Files
        </Typography>
        <Stack spacing={3}>
          <FileField
            label="Avatar"
            kind="avatar"
            accept="image/*"
            value={form.avatarUrl}
            onChange={setValue("avatarUrl")}
            helperText="Shown on the About page. Resized to 900px before upload."
          />
          <Divider />
          <FileField
            label="Resume (PDF)"
            kind="resume"
            accept="application/pdf"
            value={form.resumeUrl}
            onChange={(url) =>
              setForm({
                ...form,
                resumeUrl: url,
                // Stamped here so the resume page can show when it was last
                // refreshed without anyone maintaining the date by hand.
                resumeUpdatedAt: new Date().toISOString().slice(0, 10),
              })
            }
            helperText={
              form.resumeUpdatedAt
                ? `Last updated ${form.resumeUpdatedAt}. Replacing it takes effect within 60 seconds.`
                : "Uploading replaces the download on the resume page."
            }
          />
        </Stack>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h3" sx={{ fontSize: 20, mb: 2.5 }}>
          About
        </Typography>
        <Stack spacing={2.5}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Lead"
              fullWidth
              value={form.aboutHeadline?.lead ?? ""}
              onChange={(event) =>
                setForm({
                  ...form,
                  aboutHeadline: { ...form.aboutHeadline, lead: event.target.value },
                })
              }
            />
            <TextField
              label="Statement"
              fullWidth
              value={form.aboutHeadline?.statement ?? ""}
              onChange={(event) =>
                setForm({
                  ...form,
                  aboutHeadline: { ...form.aboutHeadline, statement: event.target.value },
                })
              }
            />
          </Stack>

          <TextField
            label="Paragraphs"
            helperText="One paragraph per blank line. These are your own words — the site renders them verbatim."
            fullWidth
            multiline
            minRows={10}
            value={(form.aboutParagraphs ?? []).join("\n\n")}
            onChange={(event) =>
              setForm({
                ...form,
                aboutParagraphs: event.target.value
                  .split(/\n\s*\n/)
                  .map((p) => p.trim())
                  .filter(Boolean),
              })
            }
          />
        </Stack>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h3" sx={{ fontSize: 20, mb: 2.5 }}>
          Home page strip
        </Typography>
        <Stack spacing={4}>
          <RowList
            title="Stats"
            rows={form.stats ?? []}
            columns={[
              { key: "value", label: "Value", flex: 1 },
              { key: "label", label: "Label", flex: 2 },
            ]}
            blank={{ value: "", label: "" }}
            onChange={setValue("stats")}
          />
          <Divider />
          <RowList
            title="Worked with"
            rows={form.clients ?? []}
            columns={[
              { key: "mark", label: "Mark", flex: 1 },
              { key: "name", label: "Name", flex: 3 },
            ]}
            blank={{ mark: "", name: "" }}
            onChange={setValue("clients")}
          />
          <Divider />
          <RowList
            title="Socials"
            rows={form.socials ?? []}
            columns={[
              { key: "label", label: "Mark", flex: 1 },
              { key: "name", label: "Name", flex: 2 },
              { key: "href", label: "URL", flex: 4 },
            ]}
            blank={{ label: "", name: "", href: "" }}
            onChange={setValue("socials")}
          />
        </Stack>
      </Paper>

      {invalid && (
        <Alert severity="warning" onClose={() => setInvalid(null)}>
          Not saved — {invalid}
        </Alert>
      )}

      <Box>
        <Button
          variant="contained"
          size="large"
          onClick={handleSave}
          disabled={status.state === "saving"}
        >
          {status.state === "saving" ? "Saving…" : "Save profile"}
        </Button>
      </Box>

      <Snackbar
        open={status.state === "saved" || status.state === "error"}
        autoHideDuration={6000}
        onClose={dismiss}
      >
        <Alert
          severity={status.state === "error" ? "error" : "success"}
          onClose={dismiss}
        >
          {status.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
