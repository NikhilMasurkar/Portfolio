import { randomUUID } from "node:crypto";
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

/**
 * Mints a presigned POST for a single upload.
 *
 * PRESIGNED POST, NOT PUT. A presigned PUT signature covers the key and
 * headers but not the body, so a size limit would be a polite request the
 * client could ignore, and anyone holding the URL could push an arbitrarily
 * large object. Only POST carries a policy document with
 * content-length-range, which S3 itself enforces. Do not "simplify" this back
 * to PUT.
 *
 * Everything the signature permits, the holder can do — so every constraint is
 * decided here, before signing, rather than checked afterwards.
 */

const MAX_BYTES = 10 * 1024 * 1024;

/** Content types that may be uploaded, and the extension each is stored under. */
const ALLOWED = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

/** Where each kind of upload lives. All under public/, which is world-readable. */
const PREFIXES = {
  project: "public/projects",
  gallery: "public/projects/gallery",
  avatar: "public/about",
  resume: "public/resume",
  post: "public/posts",
};

let client = null;
function s3() {
  if (client) return client;
  client = new S3Client({
    // Suffixed because Netlify reserves the bare AWS_* names for its own
    // build image — see .env.example.
    region: process.env.AWS_REGION_NEW,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID_NEW,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_NEW,
    },
  });
  return client;
}

export class UploadError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

/**
 * @param {object} options
 * @param {string} options.contentType  MIME type the browser will send
 * @param {string} options.kind         one of PREFIXES
 * @returns {Promise<{url: string, fields: object, publicUrl: string, key: string}>}
 */
export async function presignUpload({ contentType, kind }) {
  const extension = ALLOWED[contentType];
  if (!extension) {
    throw new UploadError(
      `Unsupported content type "${contentType}". Allowed: ${Object.keys(ALLOWED).join(", ")}`
    );
  }

  const prefix = PREFIXES[kind];
  if (!prefix) {
    throw new UploadError(
      `Unknown upload kind "${kind}". Allowed: ${Object.keys(PREFIXES).join(", ")}`
    );
  }

  const bucket = process.env.AWS_S3_BUCKET;
  const base = process.env.S3_PUBLIC_BASE_URL;
  if (!bucket || !base) {
    throw new UploadError("S3 is not configured on the server", 500);
  }

  /*
   * The two variables must describe the same bucket, and nothing else checks.
   *
   * The upload is signed for AWS_S3_BUCKET while the URL written to Firestore
   * is built from S3_PUBLIC_BASE_URL. Point them at different buckets and
   * every upload succeeds, every save succeeds, and every image 404s — with
   * the broken URL already persisted. That happened in production: the bucket
   * was nik-portfolio-new and the base URL said nikhil-portfolio.
   *
   * Refusing here costs one failed upload. The alternative is silent, and is
   * only discovered later by a visitor looking at a missing image.
   */
  if (!base.includes(bucket)) {
    throw new UploadError(
      `S3 is misconfigured: AWS_S3_BUCKET is "${bucket}" but S3_PUBLIC_BASE_URL ` +
        `is "${base}", which points somewhere else. Uploads would be stored in ` +
        `one bucket and linked in another. Fix the pair and redeploy.`,
      500
    );
  }

  /*
   * The key is generated here and never taken from the client's filename. A
   * client-supplied key is both a path-traversal primitive and a way to
   * overwrite any existing object — including one already referenced by a
   * published page.
   *
   * A random name also makes every object immutable in practice: replacing an
   * image produces a new URL, so `immutable` caching is safe and nothing needs
   * invalidating.
   */
  const key = `${prefix}/${randomUUID()}.${extension}`;

  const { url, fields } = await createPresignedPost(s3(), {
    Bucket: bucket,
    Key: key,
    Conditions: [
      // S3 rejects the upload itself if the body falls outside this range.
      ["content-length-range", 1, MAX_BYTES],
      // Pins the type, so a signature issued for an image cannot be spent on
      // something else.
      ["eq", "$Content-Type", contentType],
    ],
    Fields: {
      "Content-Type": contentType,
      // Objects never change under a key, so a year is safe.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
    Expires: 60,
  });

  return { url, fields, key, publicUrl: `${base}/${key}` };
}

export const UPLOAD_LIMITS = { maxBytes: MAX_BYTES, allowed: Object.keys(ALLOWED) };
