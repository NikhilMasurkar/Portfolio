import React, { useState } from "react";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import { Alert, Box, Button, Snackbar, Stack, Typography } from "@mui/material";
import { db } from "../../admin/firebase.js";
import EditableText from "./EditableText.jsx";
import ResumeSheet from "../resume/ResumeSheet.jsx";
import {
  resumeSchema,
  experienceSchema,
  profileSchema,
} from "../../global/schemas.js";
import { FALLBACK_PROFILE } from "../../global/fallbackContent.js";

/**
 * Edit the resume as the document, not as a form.
 *
 * Renders the same ResumeSheet /resume does, with an editable text renderer
 * injected. You change the sentence where it sits, so what you are editing and
 * what a recruiter downloads are visibly the same thing — a form beside a
 * preview always leaves you guessing how a long bullet will wrap.
 *
 * Reads directly from Firestore rather than the server's cached content,
 * because that cache is up to 60 seconds stale and saving over it would
 * silently revert a recent edit.
 */
export default function ResumeInlineEditor() {
  const [state, setState] = useState({ loading: true, error: null });
  const [profile, setProfile] = useState(null);
  const [resume, setResume] = useState(null);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    setLoaded(true);
    (async () => {
      try {
        const [profileSnap, resumeSnap] = await Promise.all([
          getDoc(doc(db, "profile", "main")),
          getDoc(doc(db, "resume", "main")),
        ]);
        const { getDocs, collection } = await import("firebase/firestore");
        const [expSnap, eduSnap] = await Promise.all([
          getDocs(collection(db, "experience")),
          getDocs(collection(db, "education")),
        ]);

        const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0);
        setProfile({ ...FALLBACK_PROFILE, ...(profileSnap.data() ?? {}) });
        setResume(resumeSnap.data() ?? null);
        setExperience(expSnap.docs.map((d) => ({ id: d.id, ...d.data() })).sort(byOrder));
        setEducation(eduSnap.docs.map((d) => ({ id: d.id, ...d.data() })).sort(byOrder));
        setState({ loading: false, error: null });
      } catch (error) {
        setState({ loading: false, error });
      }
    })();
  }

  if (state.loading) return <Typography color="text.secondary">Loading…</Typography>;
  if (state.error) {
    return <Alert severity="error">Could not load: {state.error.message}</Alert>;
  }

  const touch = (fn) => (...args) => {
    setDirty(true);
    fn(...args);
  };

  async function handleSave() {
    /*
     * Validate everything before writing anything. A batch that fails halfway
     * would leave the resume inconsistent — and this is the document that goes
     * to recruiters.
     */
    const checks = [
      [resumeSchema, resume, "resume"],
      [profileSchema, profile, "profile"],
      ...experience.map((entry) => [experienceSchema, entry, `experience/${entry.id}`]),
    ];

    for (const [schema, value, label] of checks) {
      const result = schema.safeParse(value);
      if (!result.success) {
        const issue = result.error.issues[0];
        setToast({
          severity: "error",
          message: `${label} — ${issue.path.join(".")}: ${issue.message}`,
        });
        return;
      }
    }

    setSaving(true);
    try {
      const batch = writeBatch(db);
      batch.set(doc(db, "resume", "main"), resume);
      for (const entry of experience) {
        const { id, ...body } = entry;
        batch.set(doc(db, "experience", id), body);
      }
      for (const entry of education) {
        const { id, ...body } = entry;
        batch.set(doc(db, "education", id), body);
      }
      await batch.commit();

      setDirty(false);
      setToast({
        severity: "success",
        message: "Saved. The live resume and its PDF update within 60 seconds.",
      });
    } catch (error) {
      setToast({
        severity: "error",
        message:
          error?.code === "permission-denied"
            ? "Firestore refused the write — check you are signed in as the admin account."
            : error.message,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Stack spacing={3}>
      <Alert severity="info">
        Click any text to edit it. Enter commits, Escape cancels. This is the
        same document /resume shows and the PDF prints — there is no separate
        layout to keep in step.
      </Alert>

      {/* Sticky so the save control stays reachable on a two-page resume. */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          py: 1.5,
          bgcolor: "background.default",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Button variant="contained" onClick={handleSave} disabled={saving || !dirty}>
            {saving ? "Saving…" : dirty ? "Save changes" : "Saved"}
          </Button>
          {dirty && (
            <Typography variant="body2" color="text.secondary">
              Unsaved changes
            </Typography>
          )}
        </Stack>
      </Box>

      <ResumeSheet
        profile={profile}
        resume={resume}
        experience={experience}
        education={education}
        Text={EditableText}
        onChangeResume={touch(setResume)}
        onChangeExperience={touch((index, entry) => {
          const next = [...experience];
          next[index] = entry;
          setExperience(next);
        })}
        onChangeEducation={touch((index, entry) => {
          const next = [...education];
          next[index] = entry;
          setEducation(next);
        })}
      />

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={8000}
        onClose={() => setToast(null)}
      >
        <Alert severity={toast?.severity} onClose={() => setToast(null)}>
          {toast?.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
