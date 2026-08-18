import { test, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";

import {
  validateSubmission,
  rateLimit,
  sendMail,
  __resetRateLimit,
} from "../server/contact.js";

/**
 * The contact form's defences.
 *
 * This is the one endpoint a stranger can reach, so the tests are about what
 * it refuses. The happy path is one line of the file; everything else is
 * rejection.
 */

const valid = {
  name: "Recruiter",
  email: "someone@example.com",
  subject: "Frontend role",
  message: "We have an opening you might like.",
};

beforeEach(() => __resetRateLimit());

describe("validation", () => {
  test("accepts a well-formed message", () => {
    const result = validateSubmission(valid);
    assert.equal(result.email, "someone@example.com");
    // The honeypot field must not survive into what gets sent.
    assert.equal(result.website, undefined);
  });

  test("rejects a filled honeypot without explaining why", () => {
    assert.throws(
      () => validateSubmission({ ...valid, website: "http://spam.example" }),
      (error) => {
        assert.equal(error.status, 400);
        // Telling a bot which field caught it just helps it try again.
        assert.doesNotMatch(error.message, /honeypot|website|bot/i);
        return true;
      }
    );
  });

  test("rejects a malformed address", () => {
    assert.throws(
      () => validateSubmission({ ...valid, email: "not-an-email" }),
      /email/
    );
  });

  test("rejects empty required fields", () => {
    for (const field of ["name", "email", "subject", "message"]) {
      assert.throws(
        () => validateSubmission({ ...valid, [field]: "" }),
        new RegExp(field),
        `${field} should be required`
      );
    }
  });

  test("caps field lengths so a submission cannot be used as a payload", () => {
    assert.throws(() => validateSubmission({ ...valid, message: "x".repeat(5001) }));
    assert.throws(() => validateSubmission({ ...valid, subject: "x".repeat(151) }));
    assert.throws(() => validateSubmission({ ...valid, name: "x".repeat(101) }));
  });

  test("survives a body that is missing or not an object", () => {
    // The route passes req.body straight through; a malformed request must
    // produce a 400, not a crash in the handler.
    for (const body of [undefined, null, {}, "string"]) {
      assert.throws(() => validateSubmission(body));
    }
  });
});

describe("rate limiting", () => {
  test("allows a normal number of messages, then stops", () => {
    for (let i = 0; i < 3; i += 1) {
      assert.equal(rateLimit("1.2.3.4").allowed, true, `attempt ${i + 1}`);
    }

    const blocked = rateLimit("1.2.3.4");
    assert.equal(blocked.allowed, false);
    assert.ok(blocked.retryAfterMs > 0);
  });

  test("limits each address separately", () => {
    for (let i = 0; i < 3; i += 1) rateLimit("1.2.3.4");

    // One sender hitting the cap must not lock everyone else out.
    assert.equal(rateLimit("5.6.7.8").allowed, true);
  });

  test("the window expires", () => {
    const start = 1_000_000;
    for (let i = 0; i < 3; i += 1) rateLimit("9.9.9.9", start);

    assert.equal(rateLimit("9.9.9.9", start + 60_000).allowed, false);
    assert.equal(rateLimit("9.9.9.9", start + 10 * 60_000 + 1).allowed, true);
  });
});

describe("delivery", () => {
  test("reports plainly when no mail provider is configured", async () => {
    const previous = process.env.RESEND_API_KEY;
    delete process.env.RESEND_API_KEY;

    try {
      // Accepting a message it cannot deliver would be worse than refusing —
      // the sender would believe it arrived.
      await assert.rejects(
        () => sendMail({ to: "me@example.com", message: valid }),
        (error) => {
          assert.equal(error.status, 503);
          return true;
        }
      );
    } finally {
      if (previous !== undefined) process.env.RESEND_API_KEY = previous;
    }
  });
});
