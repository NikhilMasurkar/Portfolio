import { test, describe, before } from "node:test";
import assert from "node:assert/strict";

/**
 * The upload trust boundary.
 *
 * Once a presigned POST is issued, the browser talks straight to S3 and the
 * server sees nothing more — so anything not constrained *before* signing is
 * not constrained at all. These tests are about what the signature refuses to
 * cover, far more than about the happy path.
 *
 * Presigning is local HMAC with no network call, so fake credentials are
 * enough to exercise all of it.
 */

before(() => {
  process.env.AWS_REGION_NEW = "ap-south-1";
  process.env.AWS_S3_BUCKET = "test-bucket";
  process.env.S3_PUBLIC_BASE_URL = "https://test-bucket.s3.ap-south-1.amazonaws.com";
  process.env.AWS_ACCESS_KEY_ID_NEW = "AKIAIOSFODNN7EXAMPLE";
  process.env.AWS_SECRET_ACCESS_KEY_NEW =
    "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";
});

const load = () => import("../server/upload.js");
const loadAuth = () => import("../server/auth.js");

describe("presignUpload constrains what it signs", () => {
  test("rejects a content type that is not an image or PDF", async () => {
    const { presignUpload } = await load();

    for (const contentType of [
      "text/html",
      "image/svg+xml", // SVG can carry script; not in the allowlist on purpose
      "application/javascript",
      "",
      undefined,
    ]) {
      await assert.rejects(
        () => presignUpload({ contentType, kind: "project" }),
        /Unsupported content type/,
        `${contentType} should be refused`
      );
    }
  });

  test("rejects an unknown upload kind", async () => {
    const { presignUpload } = await load();

    await assert.rejects(
      () => presignUpload({ contentType: "image/jpeg", kind: "wherever" }),
      /Unknown upload kind/
    );
  });

  test("a kind cannot escape the public/ prefix", async () => {
    const { presignUpload } = await load();

    // The client picks a *kind*, never a path. If it could pick a path, this
    // would be a way to write anywhere in the bucket.
    await assert.rejects(
      () => presignUpload({ contentType: "image/jpeg", kind: "../../private" }),
      /Unknown upload kind/
    );
  });

  test("the key is server-generated, under the right prefix", async () => {
    const { presignUpload } = await load();

    const result = await presignUpload({
      contentType: "image/jpeg",
      kind: "project",
    });

    assert.match(
      result.key,
      /^public\/projects\/[0-9a-f-]{36}\.jpg$/,
      `unexpected key: ${result.key}`
    );
    assert.equal(
      result.publicUrl,
      `https://test-bucket.s3.ap-south-1.amazonaws.com/${result.key}`
    );
  });

  test("two uploads never collide", async () => {
    const { presignUpload } = await load();

    const a = await presignUpload({ contentType: "image/png", kind: "project" });
    const b = await presignUpload({ contentType: "image/png", kind: "project" });

    // Reusing a key would silently overwrite an image a published page points at.
    assert.notEqual(a.key, b.key);
  });

  test("the extension follows the content type, not any filename", async () => {
    const { presignUpload } = await load();

    const pdf = await presignUpload({
      contentType: "application/pdf",
      kind: "resume",
    });

    assert.match(pdf.key, /^public\/resume\/[0-9a-f-]{36}\.pdf$/);
  });

  test("the signed policy caps size and pins the content type", async () => {
    const { presignUpload, UPLOAD_LIMITS } = await load();

    const { fields } = await presignUpload({
      contentType: "image/jpeg",
      kind: "project",
    });

    // The policy is what S3 enforces; the client cannot alter it without
    // invalidating the signature.
    const policy = JSON.parse(
      Buffer.from(fields.Policy, "base64").toString("utf8")
    );

    const sizeRule = policy.conditions.find(
      (c) => Array.isArray(c) && c[0] === "content-length-range"
    );
    assert.ok(sizeRule, "no content-length-range in the signed policy");
    assert.equal(sizeRule[2], UPLOAD_LIMITS.maxBytes);

    const typeRule = policy.conditions.find(
      (c) => Array.isArray(c) && c[0] === "eq" && c[1] === "$Content-Type"
    );
    assert.ok(typeRule, "content type is not pinned in the signed policy");
    assert.equal(typeRule[2], "image/jpeg");
  });
});

describe("admin claims", () => {
  test("accepts only the allowlisted, verified address", async () => {
    const { isAdminClaims } = await loadAuth();
    const admin = "nikhildmasurkar@gmail.com";

    assert.ok(isAdminClaims({ email: admin, email_verified: true }, admin));

    // Unverified is the one that matters: a provider allowing unverified
    // addresses would otherwise let someone claim the admin address.
    assert.ok(!isAdminClaims({ email: admin, email_verified: false }, admin));
    assert.ok(!isAdminClaims({ email: "someone@else.com", email_verified: true }, admin));
    assert.ok(!isAdminClaims({ email_verified: true }, admin));
    assert.ok(!isAdminClaims(null, admin));
    // No configured admin must never mean "everyone is admin".
    assert.ok(!isAdminClaims({ email: admin, email_verified: true }, undefined));
  });
});

describe("token verification", () => {
  test("refuses a missing or malformed token without calling out to Google", async () => {
    const { verifyIdToken } = await loadAuth();

    await assert.rejects(() => verifyIdToken(null), /no token/);
    await assert.rejects(() => verifyIdToken(""), /no token/);
    await assert.rejects(() => verifyIdToken("not-a-jwt"));
    // An unsigned token claiming the right project must still fail.
    await assert.rejects(() =>
      verifyIdToken(
        `${Buffer.from(JSON.stringify({ alg: "none" })).toString("base64url")}.${Buffer.from(
          JSON.stringify({ sub: "1", email: "nikhildmasurkar@gmail.com" })
        ).toString("base64url")}.`
      )
    );
  });
});
