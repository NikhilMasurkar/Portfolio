import { auth } from "./firebase.js";

/**
 * Uploads a file to S3 from the browser.
 *
 *   resize (images only) → ask the server for a signature → POST straight to S3
 *
 * The bytes never pass through the server, which is the point: a function's
 * request body cannot hold a resume PDF, and streaming one through would be
 * slower and cost more than letting S3 take it directly.
 */

/** Matches what the existing screenshots in public/projects were compressed to. */
const MAX_DIMENSION = { project: 1400, gallery: 1400, post: 1400, avatar: 900 };

const JPEG_QUALITY = 0.82;

/**
 * Shrink an image before upload.
 *
 * A phone screenshot is 4-8MB; the site's existing shots are ~300KB at 1400px.
 * Without this, one drag-and-drop quietly undoes the image budget the whole
 * design was built to — and the visitor pays for it on every page view.
 *
 * Returns the original untouched if it is already small enough, or if anything
 * goes wrong: a failed resize should cost image size, never the upload.
 */
async function resizeImage(file, maxDimension) {
  if (!file.type.startsWith("image/")) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));

    // Already within budget — re-encoding would only lose quality.
    if (scale === 1 && file.size < 600 * 1024) {
      bitmap.close();
      return file;
    }

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    // PNG screenshots become JPEG: the photographic content does not benefit
    // from lossless, and the size difference is several-fold.
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
    );
    if (!blob) return file;

    // Guard against the rare case where re-encoding grows the file.
    if (blob.size >= file.size) return file;

    return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
      type: "image/jpeg",
    });
  } catch (error) {
    console.warn("[upload] resize failed, sending the original:", error);
    return file;
  }
}

/**
 * @param {File}   file
 * @param {string} kind  project | gallery | avatar | resume | post
 * @returns {Promise<string>} the public URL to store in Firestore
 */
export async function uploadFile(file, kind) {
  const prepared = await resizeImage(file, MAX_DIMENSION[kind] ?? 1400);

  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in.");

  // Short-lived and refreshed by the SDK; the server verifies it against
  // Google's public keys.
  const token = await user.getIdToken();

  const signResponse = await fetch("/api/upload-url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ contentType: prepared.type, kind }),
  });

  if (!signResponse.ok) {
    const { error } = await signResponse.json().catch(() => ({}));
    throw new Error(error || `Could not authorise upload (${signResponse.status})`);
  }

  const { url, fields, publicUrl } = await signResponse.json();

  /*
   * Field order matters to S3: every policy field must precede the file, or it
   * rejects the request. Appending `file` last is not stylistic.
   */
  const form = new FormData();
  for (const [name, value] of Object.entries(fields)) form.append(name, value);
  form.append("file", prepared);

  /*
   * A cross-origin POST the browser refuses to make throws here rather than
   * resolving — there is no response object and no status to inspect, so the
   * !upload.ok branch below never sees it. Unhandled, it surfaced in the admin
   * panel as the browser's own words: "Failed to fetch", which says nothing
   * about the cause.
   *
   * In practice it means one thing: the bucket has no CORS rule permitting
   * POST from this origin, so the preflight never succeeded. Say that, and say
   * which origin needs allowing, because the fix is in the AWS console and
   * nobody can guess it from "Failed to fetch".
   */
  let upload;
  try {
    upload = await fetch(url, { method: "POST", body: form });
  } catch (cause) {
    throw new Error(
      `The browser could not reach S3 (${cause.message}). This is almost ` +
        `always the bucket's CORS rules: ${new URL(url).host} has to allow ` +
        `POST from ${window.location.origin}.`,
      { cause }
    );
  }

  if (!upload.ok) {
    // S3 answers with XML; the <Message> is the only useful part.
    const body = await upload.text().catch(() => "");
    const detail = body.match(/<Message>([^<]+)<\/Message>/)?.[1];
    throw new Error(
      detail || `Upload rejected by S3 (${upload.status}). Check the bucket's CORS rules.`
    );
  }

  return publicUrl;
}
