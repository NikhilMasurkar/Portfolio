import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { StringListField } from "./fields.jsx";
import { useCollection } from "../../admin/useDoc.js";
import { useSave } from "../../admin/useSave.js";

/**
 * CRUD for a small ordered collection — experience, education.
 *
 * One component driven by a field list, rather than a near-identical editor
 * per collection. These differ only in which fields they carry; the loading,
 * validation, ordering, save and delete behaviour is the same, and duplicating
 * it would mean fixing every bug several times.
 *
 * Each row saves independently. A single "save everything" button on a page of
 * long-form text is a good way to lose an afternoon's edits to one validation
 * error somewhere else on the page.
 */
export default function CollectionEditor({
  collection,
  schema,
  hint,
  fields,
  blank,
  titleOf,
}) {
  const [reload, setReload] = useState(0);
  const { loading, rows, error } = useCollection(collection, reload);
  const { status, save, remove, dismiss } = useSave();

  const [drafts, setDrafts] = useState(null);
  const [loadedFrom, setLoadedFrom] = useState(undefined);
  const [invalid, setInvalid] = useState({});

  if (!loading && loadedFrom !== rows) {
    setLoadedFrom(rows);
    setDrafts(rows);
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
    const row = { ...drafts[index], order: index };
    const result = schema.safeParse(row);

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
    // The id lives in the document path, not the body — one source, no drift.
    const { id, ...body } = result.data;
    await save(collection, id, body, { merge: false });
  }

  async function removeRow(index) {
    const row = drafts[index];
    // Never written, so there is nothing to delete — just drop it locally.
    if (!rows.some((existing) => existing.id === row.id)) {
      setDrafts(drafts.filter((_, i) => i !== index));
      return;
    }
    if (await remove(collection, row.id)) setReload((n) => n + 1);
  }

  return (
    <Stack spacing={3}>
      {hint && <Alert severity="info">{hint}</Alert>}

      {drafts.map((row, index) => (
        <Accordion key={row.id || index} defaultExpanded={drafts.length <= 2}>
          <AccordionSummary>
            <Typography sx={{ fontWeight: 600 }}>
              {titleOf(row) || "Untitled"}
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Stack spacing={2.5}>
              {fields.map((field) =>
                field.type === "list" ? (
                  <StringListField
                    key={field.key}
                    label={field.label}
                    hint={field.hint}
                    rows={row[field.key] ?? []}
                    onChange={(value) => update(index, { [field.key]: value })}
                    addLabel={field.addLabel}
                  />
                ) : (
                  <TextField
                    key={field.key}
                    label={field.label}
                    helperText={field.hint}
                    fullWidth
                    multiline={field.type === "text"}
                    minRows={field.type === "text" ? 3 : undefined}
                    value={row[field.key] ?? ""}
                    onChange={(event) =>
                      update(index, { [field.key]: event.target.value })
                    }
                  />
                )
              )}

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
          onClick={() =>
            setDrafts([...drafts, { ...blank, id: "", order: drafts.length }])
          }
        >
          Add entry
        </Button>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Typography variant="caption" color="text.disabled">
          Order follows the list above — saving a row stores its current
          position. The id becomes the document key and cannot be changed after
          the first save; rename by deleting and re-adding.
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
