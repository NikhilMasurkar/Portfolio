import React, { useState } from "react";

const EMPTY = { name: "", email: "", subject: "", message: "", website: "" };

/**
 * The contact form.
 *
 * Deliberately plain inputs with real <label>s rather than placeholder-only
 * fields — the design reference used placeholders as labels, which vanish as
 * soon as someone starts typing and leave screen readers with nothing.
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

  const field =
    "w-full rounded-xl border border-line bg-bg px-4 py-3 text-[15px] text-fg placeholder:text-dim transition-colors focus:border-primary focus:outline-none disabled:opacity-60";
  const labelClass = "mb-2 block text-[13px] font-medium text-fg-3";

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="contact-name">
            Name
          </label>
          <input
            id="contact-name"
            className={field}
            value={form.name}
            onChange={set("name")}
            required
            disabled={busy}
            autoComplete="name"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="contact-email">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            className={field}
            value={form.email}
            onChange={set("email")}
            required
            disabled={busy}
            autoComplete="email"
          />
        </div>
      </div>

      <div className="mt-5">
        <label className={labelClass} htmlFor="contact-subject">
          Subject
        </label>
        <input
          id="contact-subject"
          className={field}
          value={form.subject}
          onChange={set("subject")}
          required
          disabled={busy}
        />
      </div>

      <div className="mt-5">
        <label className={labelClass} htmlFor="contact-message">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={6}
          className={field}
          value={form.message}
          onChange={set("message")}
          required
          disabled={busy}
        />
      </div>

      {/*
        Honeypot. Hidden from people and from assistive technology, but present
        in the DOM — a bot that fills every input reveals itself. aria-hidden
        and tabIndex keep it out of the way of anyone using a screen reader or
        the keyboard; `display:none` alone is skipped by some bots.
      */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="contact-website">Leave this empty</label>
        <input
          id="contact-website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={set("website")}
        />
      </div>

      <button
        type="submit"
        disabled={busy}
        className="mt-7 inline-flex items-center gap-2.5 rounded-xl bg-[image:var(--gradient-04)] px-7 py-3.5 text-[15px] font-semibold text-fg shadow-cta transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
      >
        {busy ? "Sending…" : "Send Message"} <span aria-hidden>→</span>
      </button>

      {/*
        role="status" so the result is announced rather than only shown. A
        sighted user sees the message appear; without this a screen-reader user
        gets no feedback that anything happened at all.
      */}
      <p
        role="status"
        aria-live="polite"
        className={`mt-4 min-h-[1.25rem] text-sm ${
          state.status === "error" ? "text-pink" : "text-secondary"
        }`}
      >
        {state.message}
      </p>
    </form>
  );
}
