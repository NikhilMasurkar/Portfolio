import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const EMPTY = { name: "", email: "", subject: "", message: "", website: "" };

/**
 * The contact form, on MUI TextFields.
 *
 * TextField keeps a real <label> wired to the input — it floats rather than
 * sitting above the box, but it is still a label, not a placeholder. The
 * design reference used placeholders as labels, which vanish as soon as
 * someone types and leave screen readers with nothing.
 */
export default function ContactForm({ email }) {
  const [form, setForm] = useState(EMPTY);
  const [state, setState] = useState({ status: "idle", message: "" });

  const set = (key) => (event) => setForm({ ...form, [key]: event.target.value });

  async function handleSubmit(event) {
    event.preventDefault();
    setState({ status: "sending", message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        setState({ status: "error", message: body.error || "Could not send the message." });
        return;
      }

      setForm(EMPTY);
      setState({
        status: "sent",
        message: "Message sent. I'll get back to you soon.",
      });
    } catch {
      // Network failure, offline, blocked request — distinct from a server
      // rejection, and worth saying so rather than blaming the input.
      setState({
        status: "error",
        message: `Could not reach the server. Email ${email} directly.`,
      });
    }
  }

  const busy = state.status === "sending";

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Box className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="contact-name"
          label="Name"
          fullWidth
          required
          disabled={busy}
          autoComplete="name"
          value={form.name}
          onChange={set("name")}
        />
        <TextField
          id="contact-email"
          label="Email"
          type="email"
          fullWidth
          required
          disabled={busy}
          autoComplete="email"
          value={form.email}
          onChange={set("email")}
        />
      </Box>

      <TextField
        id="contact-subject"
        label="Subject"
        fullWidth
        required
        disabled={busy}
        className="mt-5"
        value={form.subject}
        onChange={set("subject")}
      />

      <TextField
        id="contact-message"
        label="Message"
        fullWidth
        multiline
        rows={6}
        required
        disabled={busy}
        className="mt-5"
        value={form.message}
        onChange={set("message")}
      />

      {/*
        Honeypot. Hidden from people and from assistive technology, but present
        in the DOM — a bot that fills every input reveals itself. aria-hidden
        and tabIndex keep it out of the way of anyone using a screen reader or
        the keyboard; `display:none` alone is skipped by some bots.
      */}
      <Box className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="contact-website">Leave this empty</label>
        <input
          id="contact-website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={set("website")}
        />
      </Box>

      <Button
        type="submit"
        disabled={busy}
        startIcon={busy ? <CircularProgress size={16} color="inherit" /> : null}
        className="mt-7 inline-flex items-center gap-2.5 rounded-xl bg-[image:var(--gradient-04)] px-7 py-3.5 text-[15px] font-semibold text-fg shadow-cta transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
      >
        {busy ? "Sending…" : "Send Message"} <span aria-hidden>→</span>
      </Button>

      {/*
        role="status" so the result is announced rather than only shown. A
        sighted user sees the message appear; without this a screen-reader user
        gets no feedback that anything happened at all. It stays in the DOM
        while empty — an aria-live region added at the same moment as its text
        is not reliably announced.
      */}
      <Typography
        role="status"
        aria-live="polite"
        className={`mt-4 min-h-[1.25rem] text-sm ${
          state.status === "error" ? "text-pink" : "text-secondary"
        }`}
      >
        {state.message}
      </Typography>
    </Box>
  );
}
