import { messageSchema } from "../src/app/global/schemas.js";

/**
 * Contact form handling: validation, spam defences and delivery.
 *
 * The transport is deliberately isolated in sendMail() — swapping Resend for
 * EmailJS, SES or anything else touches that function alone.
 */

/** Requests allowed per IP per window. Generous for a human, useless to a bot. */
const RATE_LIMIT = { max: 3, windowMs: 10 * 60 * 1000 };

/*
 * In-memory, therefore per-instance.
 *
 * On Netlify each warm function instance keeps its own map, so a determined
 * flood spread across cold starts gets more than `max` through. That is
 * accepted: this exists to stop casual abuse and accidental double-submits,
 * and the honeypot plus validation carry the rest. A shared store would mean
 * another service for a portfolio contact form.
 */
const hits = new Map();

export function rateLimit(ip, now = Date.now()) {
  const window = hits.get(ip)?.filter((t) => now - t < RATE_LIMIT.windowMs) ?? [];

  if (window.length >= RATE_LIMIT.max) {
    hits.set(ip, window);
    return { allowed: false, retryAfterMs: RATE_LIMIT.windowMs - (now - window[0]) };
  }

  window.push(now);
  hits.set(ip, window);

  // Opportunistic sweep so the map cannot grow without bound on a long-lived
  // instance. Cheap because it only runs when the map is already large.
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_LIMIT.windowMs)) hits.delete(key);
    }
  }

  return { allowed: true };
}

/** Test seam. */
export function __resetRateLimit() {
  hits.clear();
}

export class ContactError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

/**
 * Validate a submission.
 *
 * @param {object} body raw request body
 * @returns the parsed message
 * @throws {ContactError} with a message safe to show the sender
 */
export function validateSubmission(body) {
  /*
   * Honeypot. A field hidden from people but present in the DOM, so a bot
   * filling every input reveals itself. Silence is the point — telling a bot
   * why it was rejected just helps it try again.
   */
  if (body?.website) throw new ContactError("Message rejected.", 400);

  const result = messageSchema.safeParse({
    name: body?.name,
    email: body?.email,
    subject: body?.subject,
    message: body?.message,
  });

  if (!result.success) {
    // Field-level, so the form can say which input is wrong rather than
    // failing as a whole.
    const issue = result.error.issues[0];
    const field = issue.path[0] ?? "form";
    throw new ContactError(`Please check the ${field} field: ${issue.message}`);
  }

  return result.data;
}

/**
 * Delivery. The only part that knows which provider is in use.
 *
 * Resend is the configured transport; without a key the route reports that
 * plainly rather than accepting a message it cannot deliver. A form that
 * silently swallows submissions is worse than one that says it is offline.
 */
export async function sendMail({ to, message }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new ContactError(
      "The contact form is not configured to send mail yet.",
      503
    );
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>",
      to: [to],
      // Replying goes to the sender, not to the form's own address.
      reply_to: message.email,
      subject: `Portfolio enquiry: ${message.subject}`,
      text: [
        `From: ${message.name} <${message.email}>`,
        `Subject: ${message.subject}`,
        "",
        message.message,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    // Logged in full, reported vaguely — provider errors can carry account
    // details that do not belong in a public response.
    console.error("[contact] Resend rejected the message:", response.status, detail);
    throw new ContactError("Could not send the message. Please email directly.", 502);
  }
}
