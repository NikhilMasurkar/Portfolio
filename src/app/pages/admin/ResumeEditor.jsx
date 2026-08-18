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
import { StringListField, GroupListField, Hint } from "./fields.jsx";
import { useDoc } from "../../admin/useDoc.js";
import { useSave } from "../../admin/useSave.js";
import { resumeSchema } from "../../global/schemas.js";

/**
 * The CV sections that exist only on the resume.
 *
 * Experience and education are edited separately, because they also feed
 * /about — the resume assembles them rather than owning them.
 *
 * Everything here is what a recruiter reads, so it is validated against the
 * same schema the server validates with before it can be saved: a document
 * the site would refuse to render would show up as a silently missing section
 * in a PDF someone had already sent out.
 */

const BLANK = {
  headline: "",
  summary: "",
  achievements: [],
  skillGroups: [],
  keyProjects: [],
  professionalDevelopment: [],
};

export default function ResumeEditor() {
  const { loading, data, error } = useDoc("resume", "main");
  const { status, save, dismiss } = useSave();
  const [form, setForm] = useState(null);
  const [invalid, setInvalid] = useState(null);
  const [loadedFrom, setLoadedFrom] = useState(undefined);

  // Seeded during render, once — see the note in ProfileEditor.
  if (!loading && loadedFrom !== data) {
    setLoadedFrom(data);
    setForm({ ...BLANK, ...(data ?? {}) });
  }

  if (loading) return <Typography color="text.secondary">Loading…</Typography>;
  if (error) return <Alert severity="error">Could not load: {error.message}</Alert>;
  if (!form) return null;

  const set = (key) => (event) => setForm({ ...form, [key]: event.target.value });
  const setValue = (key) => (value) => setForm({ ...form, [key]: value });

  const updateProject = (index, patch) => {
    const next = [...form.keyProjects];
    next[index] = { ...next[index], ...patch };
    setForm({ ...form, keyProjects: next });
  };

  async function handleSave() {
    const result = resumeSchema.safeParse(form);
    if (!result.success) {
      setInvalid(
        result.error.issues
          .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
          .join(" · ")
      );
      return;
    }
    setInvalid(null);
    await save("resume", "main", result.data);
  }

  return (
    <Stack spacing={4}>
      <Alert severity="info" action={
        <Button color="inherit" size="small" href="/resume/edit">
          Edit on the page
        </Button>
      }>
        These sections appear on <strong>/resume</strong> and in the PDF it
        generates. The PDF is the page printed, so anything you change here is
        in the next download — there is no file to re-upload.
        <br />
        This form is the structural view: it adds, removes and reorders. To
        reword something in place, edit it on the document itself.
      </Alert>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h3" sx={{ fontSize: 20, mb: 2.5 }}>
          Header &amp; summary
        </Typography>
        <Stack spacing={2.5}>
          <TextField
            label="Headline"
            fullWidth
            value={form.headline}
            onChange={set("headline")}
            helperText="The line under your name, e.g. React Developer | React Native | Mobile Application Development"
          />
          <TextField
            label="Professional summary"
            fullWidth
            multiline
            minRows={4}
            value={form.summary}
            onChange={set("summary")}
            helperText="The opening paragraph. Recruiters read this first and often only this."
          />
        </Stack>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <StringListField
          label="Key achievements"
          hint="Bulleted, near the top of the resume. Keep every figure here sourceable — these get verified."
          rows={form.achievements}
          onChange={setValue("achievements")}
          addLabel="Add achievement"
        />
      </Paper>

      <Paper sx={{ p: 3 }}>
        <GroupListField
          label="Technical skills"
          hint="Renders as two columns, filling top to bottom in this order. Separate items with commas."
          groups={form.skillGroups}
          onChange={setValue("skillGroups")}
        />
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle2">Key projects</Typography>
        <Hint>
          Separate from the Projects section of the site — these are written for
          a CV rather than as case studies.
        </Hint>

        <Stack spacing={3}>
          {form.keyProjects.map((project, index) => (
            <Box
              key={index}
              sx={{ border: 1, borderColor: "divider", borderRadius: 2, p: 2.5 }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <TextField
                  label="Project name"
                  fullWidth
                  value={project.name ?? ""}
                  onChange={(event) => updateProject(index, { name: event.target.value })}
                />
                <IconButton
                  aria-label={`Remove project ${index + 1}`}
                  onClick={() =>
                    setForm({
                      ...form,
                      keyProjects: form.keyProjects.filter((_, i) => i !== index),
                    })
                  }
                >
                  ✕
                </IconButton>
              </Stack>

              <StringListField
                label="Bullets"
                rows={project.bullets ?? []}
                onChange={(bullets) => updateProject(index, { bullets })}
                addLabel="Add bullet"
              />
            </Box>
          ))}
        </Stack>

        <Button
          size="small"
          sx={{ mt: 2 }}
          onClick={() =>
            setForm({
              ...form,
              keyProjects: [...form.keyProjects, { name: "", bullets: [] }],
            })
          }
        >
          Add project
        </Button>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <StringListField
          label="Professional development"
          hint="The closing section of the resume."
          rows={form.professionalDevelopment}
          onChange={setValue("professionalDevelopment")}
          addLabel="Add item"
        />
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
          {status.state === "saving" ? "Saving…" : "Save resume"}
        </Button>
      </Box>

      <Divider />

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
