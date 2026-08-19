import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { EMAILJS_CONFIG } from "../../global/contactConfig.js";

const EMPTY = { name: "", email: "", subject: "", message: "", website: "" };

/**
 * The contact form, sending through EmailJS.
 *
 * Posted straight to EmailJS's REST endpoint rather than through
 * @emailjs/browser. The SDK is a wrapper around exactly this one request, and
 * a dependency in the bundle every visitor downloads has to earn more than
 * that.
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

  /**
   * Validated here because nothing else will. The old server route ran Zod
   * over the submission; EmailJS accepts whatever it is handed and delivers a
   * blank enquiry. `noValidate` on the form means the browser is not checking
   * either — that is deliberate, so the messages are ours and are announced.
   */
  function firstProblem() {
    if (!form.name.trim()) return "Please add your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      return "That email address does not look right.";
    if (!form.subject.trim()) return "Please add a subject.";
    if (form.message.trim().length < 10)
      return "Please write a little more in the message.";
    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const problem = firstProblem();
    if (problem) {
      setState({ status: "error", message: problem });
      return;
    }

    /*
     * Honeypot filled means a bot. Reported as success and dropped on the
     * floor: telling a bot it was caught just teaches whoever wrote it to
     * stop filling the field.
     */
    if (form.website) {
      setForm(EMPTY);
      setState({ status: "sent", message: "Message sent. I'll get back to you soon." });
      return;
    }

    setState({ status: "sending", message: "" });

    try {
      const response = await fetch(EMAILJS_CONFIG.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: EMAILJS_CONFIG.serviceId,
          template_id: EMAILJS_CONFIG.templateId,
          user_id: EMAILJS_CONFIG.publicKey,
          // Names fixed by the EmailJS template — see contactConfig.js.
          template_params: {
            from_name: form.name,
            from_email: form.email,
            subject: form.subject,
            message: form.message,
          },
        }),
      });

      if (!response.ok) {
        // EmailJS answers in plain text, not JSON, and the body is the only
        // thing that says which of the three ids was wrong.
        const detail = await response.text().catch(() => "");
        throw new Error(detail || `EmailJS returned ${response.status}`);
      }

      setForm(EMPTY);
      setState({
        status: "sent",
        message: "Message sent. I'll get back to you soon.",
      });
    } catch (error) {
      console.error("Contact form submission failed:", error);
      setState({
        status: "error",
        message: `Could not send the message. Email ${email} directly.`,
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
