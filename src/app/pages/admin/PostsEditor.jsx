import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  FormControlLabel,
  Paper,
  Snackbar,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import FileField from "./FileField.jsx";
import Markdown from "../blog/Markdown.jsx";
import { useCollection } from "../../admin/useDoc.js";
import { useSave } from "../../admin/useSave.js";
import { postSchema } from "../../global/schemas.js";

/**
 * Blog posts.
 *
 * The body is Markdown in a textarea with a preview tab, rather than a
 * rich-text editor. A WYSIWYG is a large dependency and a permanent
 * maintenance cost for a single author, and it stores markup that then has to
 * be sanitised on the way out. Markdown stays readable in the database.
 *
 * The preview renders through the same component the public post uses, so it
 * cannot show something the site would render differently.
 */

const BLANK = {
  slug: "",
  title: "",
  summary: "",
  body: "",
  coverUrl: "",
  tags: [],
  publishedAt: new Date().toISOString().slice(0, 10),
  published: false,
};

function BodyField({ value, onChange }) {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 1.5 }}>
        <Tab label="Markdown" />
        <Tab label="Preview" />
      </Tabs>

      {tab === 0 ? (
        <TextField
          fullWidth
          multiline
          minRows={16}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={"## A heading\n\nA paragraph.\n\n- a list item\n\n`inline code`"}
          slotProps={{ input: { sx: { fontFamily: "monospace", fontSize: 13.5 } } }}
        />
      ) : (
        <Box
          sx={{
            minHeight: 320,
            p: 3,
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            bgcolor: "background.default",
          }}
        >
          {value.trim() ? (
            <Markdown>{value}</Markdown>
          ) : (
            <Typography color="text.disabled">Nothing to preview yet.</Typography>
          )}
        </Box>
      )}
    </Box>
  );
}

export default function PostsEditor() {
  const [reload, setReload] = useState(0);
  const { loading, rows, error } = useCollection("posts", reload);
  const { status, save, remove, dismiss } = useSave();

  const [drafts, setDrafts] = useState(null);
  const [loadedFrom, setLoadedFrom] = useState(undefined);
  const [invalid, setInvalid] = useState({});

  if (!loading && loadedFrom !== rows) {
    setLoadedFrom(rows);
    // The document id is the slug, matching how content.js reads it back.
    setDrafts(rows.map((row) => ({ ...BLANK, ...row, slug: row.id })));
  }

  if (loading) return <Typography color="text.secondary">Loading…</Typography>;
  if (error) return <Alert severity="error">Could not load: {error.message}</Alert>;
  if (!drafts) return null;

  const update = (index, patch) => {
    const next = [...drafts];
    next[index] = { ...next[index], ...patch };
    setDrafts(next);
  };

  async function saveRow(index) {
    const row = {
      ...drafts[index],
      // Stamped on save so the post page can show a real "updated" date
      // without anyone maintaining it by hand.
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    const result = postSchema.safeParse(row);

    if (!result.success) {
      setInvalid({
        ...invalid,
        [index]: result.error.issues
          .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
          .join(" · "),
      });
      return;
    }

    setInvalid({ ...invalid, [index]: null });
    const { slug, ...body } = result.data;
    if (await save("posts", slug, body, { merge: false })) setReload((n) => n + 1);
  }

  async function removeRow(index) {
    const row = drafts[index];
    if (!rows.some((existing) => existing.id === row.slug)) {
      setDrafts(drafts.filter((_, i) => i !== index));
      return;
    }
    if (await remove("posts", row.slug)) setReload((n) => n + 1);
  }

  return (
    <Stack spacing={3}>
      <Alert severity="info">
        Drives <strong>/blog</strong> and each post page. Publishing creates the
        post&apos;s URL and adds it to the sitemap; unpublishing removes both, so
        a withdrawn post returns a genuine 404 rather than lingering as a stale
        link.
      </Alert>

      {drafts.length === 0 && (
        <Alert severity="warning">
          No posts yet, so /blog shows an empty state. That is deliberate — an
          invented article is worse than an honest empty page.
        </Alert>
      )}

      {drafts.map((row, index) => (
        <Accordion key={row.slug || index}>
          <AccordionSummary>
            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
              <Typography sx={{ fontWeight: 600 }}>
                {row.title || "New post"}
              </Typography>
              {row.published ? (
                <Chip size="small" color="success" variant="outlined" label="Published" />
              ) : (
                <Chip size="small" label="Draft" variant="outlined" />
              )}
            </Stack>
          </AccordionSummary>

          <AccordionDetails>
            <Stack spacing={2.5}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Slug"
                  fullWidth
                  value={row.slug}
                  onChange={(e) => update(index, { slug: e.target.value })}
                  helperText="The URL. Lowercase, digits and hyphens; fixed after the first save."
                />
                <TextField
                  label="Published date"
                  type="date"
                  fullWidth
                  value={row.publishedAt}
                  onChange={(e) => update(index, { publishedAt: e.target.value })}
                  slotProps={{ inputLabel: { shrink: true } }}
                  helperText="Also the sort order — newest first."
                />
              </Stack>

              <TextField
                label="Title"
                fullWidth
                value={row.title}
                onChange={(e) => update(index, { title: e.target.value })}
              />

              <TextField
                label="Summary"
                fullWidth
                multiline
                minRows={2}
                value={row.summary}
                onChange={(e) => update(index, { summary: e.target.value })}
                helperText="Shown on the card and used as the meta description and link preview."
              />

              <TextField
                label="Tags"
                fullWidth
                value={row.tags.join(", ")}
                onChange={(e) =>
                  update(index, {
                    tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                  })
                }
                helperText="Comma separated."
              />

              <FileField
                label="Cover image"
                kind="post"
                value={row.coverUrl}
                onChange={(url) => update(index, { coverUrl: url })}
                helperText="Optional. Used on the card, at the top of the post, and as the link preview image."
              />

              <BodyField value={row.body} onChange={(body) => update(index, { body })} />

              <FormControlLabel
                control={
                  <Switch
                    checked={row.published}
                    onChange={(e) => update(index, { published: e.target.checked })}
                  />
                }
                label="Published"
              />

              {invalid[index] && (
                <Alert severity="warning">Not saved — {invalid[index]}</Alert>
              )}

              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={() => saveRow(index)}>
                  Save
                </Button>
                <Button color="error" onClick={() => removeRow(index)}>
                  Delete
                </Button>
              </Stack>
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}

      <Box>
        <Button onClick={() => setDrafts([...drafts, { ...BLANK }])}>Add post</Button>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Typography variant="caption" color="text.disabled">
          Reading time is estimated from the body when the page renders, so it
          never goes stale after an edit.
        </Typography>
      </Paper>

      <Snackbar
        open={status.state === "saved" || status.state === "error"}
        autoHideDuration={6000}
        onClose={dismiss}
      >
        <Alert severity={status.state === "error" ? "error" : "success"} onClose={dismiss}>
          {status.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
