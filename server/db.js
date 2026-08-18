/**
 * Firestore reads over the REST API — no service account, no stored secret.
 *
 * WHY NOT THE ADMIN SDK
 * Key creation is blocked on this project by a policy applied above the
 * project, and the project is personal, so there is no organisation console in
 * which to lift it. Rather than work around that, this drops the credential
 * entirely: the server reads through the public REST endpoint, governed by the
 * same security rules that govern any visitor.
 *
 * That is a genuinely better position than a service-account JSON in an
 * environment variable — there is no long-lived secret to leak or rotate. The
 * cost is that the server can only read what is publicly readable, which is
 * exactly what SSR renders. Anything privileged (unpublished drafts) is read
 * by the admin panel in the browser, authenticated as the admin.
 *
 * The API key is not a credential. It identifies the project for quota and is
 * public by design — it ships in the client bundle either way. Access is
 * decided by security rules.
 *
 * Presents the same surface content.js expects of a Firestore client, so
 * swapping back to the Admin SDK later touches this file alone.
 */

const BASE = "https://firestore.googleapis.com/v1";

/** Firestore REST wraps every scalar in a type tag; unwrap recursively. */
function decodeValue(value) {
  if ("stringValue" in value) return value.stringValue;
  if ("booleanValue" in value) return value.booleanValue;
  // Sent as a string to survive 64-bit values that JSON cannot hold exactly.
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("timestampValue" in value) return value.timestampValue;
  if ("nullValue" in value) return null;
  if ("arrayValue" in value) {
    return (value.arrayValue.values ?? []).map(decodeValue);
  }
  if ("mapValue" in value) return decodeFields(value.mapValue.fields);
  // bytesValue, referenceValue and geoPointValue are unused by this schema.
  return undefined;
}

function decodeFields(fields) {
  const out = {};
  for (const [key, value] of Object.entries(fields ?? {})) {
    out[key] = decodeValue(value);
  }
  return out;
}

/** "projects/databases/(default)/documents/posts/my-slug" -> "my-slug" */
const idOf = (name) => name.split("/").pop();

/**
 * Collections carrying a `published` flag, read through a filtered query.
 *
 * This is not an optimisation. A plain GET on a collection is a *list*
 * operation, and Firestore rejects a list whose rule depends on document data
 * — it will not evaluate per-document to decide what to withhold. So a rule of
 * `allow read: if resource.data.published == true` makes an unfiltered list
 * fail outright, and the only rule that would let it through is "this
 * collection is entirely public", which would expose unpublished drafts to
 * anyone who knows the project id.
 *
 * Asking for `published == true` explicitly is what lets the rule stay strict.
 * The rest (experience, education, skills) are public in their entirety and
 * need no filter.
 */
const PUBLISHED_FILTERED = new Set(["projects", "posts"]);

function createClient({ projectId, apiKey }) {
  const documents = `${BASE}/projects/${projectId}/databases/(default)/documents`;
  const key = apiKey ? `?key=${encodeURIComponent(apiKey)}` : "";

  async function request(path, init) {
    // Custom methods hang off the collection path directly — "documents:runQuery",
    // not "documents/:runQuery", which 404s.
    const url = path.startsWith(":")
      ? `${documents}${path}${key}`
      : `${documents}/${path}${key}`;
    const response = await fetch(url, init);

    // A collection with no documents, or a document that does not exist.
    if (response.status === 404) return null;

    if (!response.ok) {
      throw new Error(
        `Firestore ${response.status} for ${path}: ${await response.text()}`
      );
    }
    return response.json();
  }

  async function listPublished(name) {
    const body = await request(":runQuery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: name }],
          where: {
            fieldFilter: {
              field: { fieldPath: "published" },
              op: "EQUAL",
              value: { booleanValue: true },
            },
          },
        },
      }),
    });

    // runQuery returns one entry per result, plus bare {readTime} entries
    // when there are none — hence the filter rather than a plain map.
    return (body ?? []).filter((row) => row.document).map((row) => row.document);
  }

  async function listAll(name) {
    const body = await request(name);
    // Firestore omits `documents` entirely for an empty collection.
    return body?.documents ?? [];
  }

  return {
    collection(name) {
      return {
        async get() {
          const docs = PUBLISHED_FILTERED.has(name)
            ? await listPublished(name)
            : await listAll(name);

          return {
            docs: docs.map((doc) => ({
              id: idOf(doc.name),
              data: () => decodeFields(doc.fields),
            })),
          };
        },
        doc(id) {
          return {
            async get() {
              const body = await request(`${name}/${id}`);
              return {
                exists: body !== null,
                data: () => (body ? decodeFields(body.fields) : null),
              };
            },
          };
        },
      };
    },
  };
}

let client = null;
let warned = false;

export function getDb() {
  if (client) return client;

  const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
  const apiKey = process.env.VITE_FIREBASE_API_KEY;

  if (!projectId) {
    // Once per process, not once per request — this runs on every render.
    if (!warned) {
      console.warn(
        "[db] VITE_FIREBASE_PROJECT_ID unset; serving fallback content."
      );
      warned = true;
    }
    return null;
  }

  client = createClient({ projectId, apiKey });
  return client;
}

/** Exposed for tests; production goes through getDb(). */
export const __createClient = createClient;
