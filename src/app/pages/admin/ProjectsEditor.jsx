import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  FormControlLabel,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import FileField from "./FileField.jsx";
import { Hint } from "./fields.jsx";
import { useCollection } from "../../admin/useDoc.js";
import { useSave } from "../../admin/useSave.js";
import { projectSchema, projectCategories } from "../../global/schemas.js";
import { writeCaseStudies } from "../../admin/writeCaseStudies.js";
import { withDraftKey, DRAFT_KEY } from "../../admin/draftKey.js";

/**
 * Projects, including the case-study prose.
 *
 * Not folded into CollectionEditor: a project carries an image, a gallery,
 * seven long-form sections and a publish flag, and bending a generic
 * field-list editor around all of that would make it worse at both jobs.
 *
 * `published` is the one control with teeth. It decides whether the project
 * appears on the site AND whether its URL exists at all — server/sitemap.js
 * builds the 404 list from the same published set — so unpublishing something
 * makes its page return a genuine 404 rather than lingering as a stale link.
 */

const CASE_SECTIONS = [
  ["overview", "Overview"],
  ["problem", "The problem"],
  ["role", "My role"],
  ["architecture", "Architecture"],
  ["decisions", "Key decisions & trade-offs"],
  ["results", "Results"],
  ["lessons", "Lessons"],
];

const BLANK = {
  slug: "",
  name: "",
  category: "Web",
  summary: "",
  image: "",
  tech: [],
  year: new Date().getFullYear(),
  featured: false,
  published: false,
  order: 0,
  gallery: [],
  caseStudy: {},
};

export default function ProjectsEditor() {
  const [reload, setReload] = useState(0);
  const { loading, rows, error } = useCollection("projects", reload);
  const { status, save, remove, dismiss } = useSave();

  const [drafts, setDrafts] = useState(null);
  const [loadedFrom, setLoadedFrom] = useState(undefined);
  const [invalid, setInvalid] = useState({});
  const [importing, setImporting] = useState(null);

  if (!loading && loadedFrom !== rows) {
    setLoadedFrom(rows);
    // The document id is the slug — see content.js, which reads it back that way.
    setDrafts(rows.map((row) => withDraftKey({ ...BLANK, ...row, slug: row.id })));
  }

  if (loading) return <Typography color="text.secondary">Loading…</Typography>;
  if (error) return <Alert severity="error">Could not load: {error.message}</Alert>;
  if (!drafts) return null;

  const update = (index, patch) => {
    const next = [...drafts];
    next[index] = { ...next[index], ...patch };
    setDrafts(next);
  };

  const updateCase = (index, key, value) =>
    update(index, { caseStudy: { ...drafts[index].caseStudy, [key]: value } });

  async function saveRow(index) {
    const row = { ...drafts[index], order: index };
    const result = projectSchema.safeParse(row);

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
    if (await save("projects", slug, body, { merge: false })) setReload((n) => n + 1);
  }

  async function removeRow(index) {
    const row = drafts[index];
    if (!rows.some((existing) => existing.id === row.slug)) {
      setDrafts(drafts.filter((_, i) => i !== index));
      return;
    }
    if (await remove("projects", row.slug)) setReload((n) => n + 1);
  }

  async function importCaseStudies() {
    setImporting("running");
    try {
      await writeCaseStudies();
      setImporting("done");
      setReload((n) => n + 1);
    } catch (error) {
      setImporting(`failed: ${error.message}`);
    }
  }

  return (
    <Stack spacing={3}>
      <Alert
        severity="success"
        action={
          <Button
            color="inherit"
            size="small"
            onClick={importCaseStudies}
            disabled={importing === "running"}
          >
            {importing === "running" ? "Writing…" : "Write case studies"}
          </Button>
        }
      >
        Case studies written from the actual project repositories are ready to
        import. This only fills the case-study fields — everything else on each
        project is left exactly as it is.
        {importing && importing !== "running" && (
          <>
            <br />
            {importing === "done" ? "Done — reload to see them." : importing}
          </>
        )}
      </Alert>

      <Alert severity="info">
        Drives <strong>/projects</strong>, each case study, and the featured row
        on the home page. Unpublishing removes a project from the site and from
        the sitemap, and its URL starts returning 404 — that is deliberate, so a
        withdrawn project cannot linger as a stale link.
      </Alert>

      {drafts.map((row, index) => (
        <Accordion key={row[DRAFT_KEY]}>
          <AccordionSummary>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", flexWrap: "wrap" }}>
              <Typography sx={{ fontWeight: 600 }}>
                {row.name || "New project"}
              </Typography>
              {row.published ? (
                <Chip size="small" color="success" variant="outlined" label="Published" />
              ) : (
                <Chip size="small" label="Draft" variant="outlined" />
              )}
              {row.featured && <Chip size="small" color="primary" label="Featured" />}
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
                  helperText="The URL and the document key. Lowercase, digits and hyphens; cannot be changed after the first save."
                />
                <TextField
                  label="Name"
                  fullWidth
                  value={row.name}
                  onChange={(e) => update(index, { name: e.target.value })}
                />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  select
                  label="Category"
                  fullWidth
                  value={row.category}
                  onChange={(e) => update(index, { category: e.target.value })}
                  helperText="Also drives the filter buttons on /projects."
                >
                  {projectCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Year"
                  type="number"
                  fullWidth
                  value={row.year}
                  onChange={(e) => update(index, { year: Number(e.target.value) })}
                />
              </Stack>

              <TextField
                label="Summary"
                fullWidth
                multiline
                minRows={3}
                value={row.summary}
                onChange={(e) => update(index, { summary: e.target.value })}
                helperText="Shown on the card and used as the page's meta description."
              />

              <TextField
                label="Technologies"
                fullWidth
                value={row.tech.join(", ")}
                onChange={(e) =>
                  update(index, {
                    tech: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                  })
                }
                helperText="Comma separated. The first four show on the card."
              />

              <FileField
                label="Cover screenshot"
                kind="project"
                value={row.image}
                onChange={(url) => update(index, { image: url })}
                helperText="The real product screenshot. Resized to 1400px on upload, and shown inside a device frame on the case study."
              />

              <Stack direction="row" spacing={3} sx={{ flexWrap: "wrap" }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={row.published}
                      onChange={(e) => update(index, { published: e.target.checked })}
                    />
                  }
                  label="Published"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={row.featured}
                      onChange={(e) => update(index, { featured: e.target.checked })}
                    />
                  }
                  label="Featured on home"
                />
              </Stack>

              <Divider />

              <Box>
                <Typography variant="subtitle2">Case study</Typography>
                <Hint>
                  Every section is optional and an empty one renders nothing, so
                  a short case study looks deliberate rather than unfinished.
                  Separate paragraphs with a blank line.
                </Hint>

                <Stack spacing={2}>
                  {CASE_SECTIONS.map(([key, label]) => (
                    <TextField
                      key={key}
                      label={label}
                      fullWidth
                      multiline
                      minRows={3}
                      value={row.caseStudy?.[key] ?? ""}
                      onChange={(e) => updateCase(index, key, e.target.value)}
                    />
                  ))}
                </Stack>
              </Box>

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
        <Button
          onClick={() => setDrafts([...drafts, withDraftKey({ ...BLANK, order: drafts.length })])}
        >
          Add project
        </Button>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Typography variant="caption" color="text.disabled">
          Order follows the list above. The featured row on the home page shows
          projects flagged Featured, in this same order.
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
