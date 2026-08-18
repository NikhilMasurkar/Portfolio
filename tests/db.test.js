import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

import { __createClient } from "../server/db.js";

/**
 * The Firestore REST wire format, decoded.
 *
 * Every scalar arrives wrapped in a type tag and integers arrive as strings,
 * so a decoding slip produces plausible-looking wrong data rather than an
 * error — `year` as "2026" instead of 2026 would fail Zod and silently drop
 * the document.
 */

const realFetch = globalThis.fetch;
let calls;

function stubFetch(responder) {
  calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    const { status = 200, body } = responder(url, init) ?? {};
    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => body,
      text: async () => JSON.stringify(body),
    };
  };
}

const client = () => __createClient({ projectId: "p", apiKey: "k" });

beforeEach(() => {
  calls = [];
});
afterEach(() => {
  globalThis.fetch = realFetch;
});

test("unwraps every scalar type the schema uses", async () => {
  stubFetch(() => ({
    body: {
      documents: [
        {
          name: "projects/databases/(default)/documents/experience/one",
          fields: {
            role: { stringValue: "Senior Software Developer" },
            order: { integerValue: "3" },
            active: { booleanValue: true },
            retired: { nullValue: null },
            ratio: { doubleValue: 1.5 },
          },
        },
      ],
    },
  }));

  const { docs } = await client().collection("experience").get();
  const data = docs[0].data();

  assert.equal(data.role, "Senior Software Developer");
  // Sent as a string to survive 64-bit values; must come back a number or Zod
  // rejects the document.
  assert.equal(data.order, 3);
  assert.equal(typeof data.order, "number");
  assert.equal(data.active, true);
  assert.equal(data.retired, null);
  assert.equal(data.ratio, 1.5);
});

test("decodes arrays and nested maps", async () => {
  stubFetch(() => ({
    body: [
      {
        document: {
          name: "a/b/c/documents/projects/mezorder-pos",
          fields: {
            tech: {
              arrayValue: {
                values: [{ stringValue: "Next.js" }, { stringValue: "Supabase" }],
              },
            },
            gallery: {
              arrayValue: {
                values: [
                  {
                    mapValue: {
                      fields: {
                        src: { stringValue: "/projects/a.jpg" },
                        caption: { stringValue: "Dashboard" },
                      },
                    },
                  },
                ],
              },
            },
            caseStudy: {
              mapValue: { fields: { overview: { stringValue: "# Hi" } } },
            },
          },
        },
      },
    ],
  }));

  const { docs } = await client().collection("projects").get();
  const data = docs[0].data();

  assert.deepEqual(data.tech, ["Next.js", "Supabase"]);
  assert.deepEqual(data.gallery, [{ src: "/projects/a.jpg", caption: "Dashboard" }]);
  assert.deepEqual(data.caseStudy, { overview: "# Hi" });
});

test("the document id is the trailing path segment", async () => {
  stubFetch(() => ({
    body: {
      documents: [
        {
          name: "projects/p/databases/(default)/documents/experience/avinash-2026",
          fields: {},
        },
      ],
    },
  }));

  const { docs } = await client().collection("experience").get();

  // content.js turns this into the slug, so a wrong split breaks every URL.
  assert.equal(docs[0].id, "avinash-2026");
});

test("drafts are excluded by the query, not after the fact", async () => {
  stubFetch(() => ({ body: [] }));

  await client().collection("posts").get();

  const { url, init } = calls[0];
  // Must be the custom method, appended with a colon and no slash.
  assert.match(url, /documents:runQuery\?key=k$/);
  assert.equal(init.method, "POST");

  const query = JSON.parse(init.body).structuredQuery;
  assert.deepEqual(query.from, [{ collectionId: "posts" }]);
  // Firestore refuses a list whose rule reads document data, so this filter is
  // what allows the rules to keep drafts private.
  assert.equal(query.where.fieldFilter.field.fieldPath, "published");
  assert.equal(query.where.fieldFilter.value.booleanValue, true);
});

test("collections without a draft state use a plain list", async () => {
  stubFetch(() => ({ body: { documents: [] } }));

  await client().collection("skills").get();

  assert.match(calls[0].url, /documents\/skills\?key=k$/);
  assert.equal(calls[0].init, undefined);
});

test("an empty collection yields no documents rather than throwing", async () => {
  // Firestore omits `documents` entirely, and runQuery returns bare readTime
  // rows — both look like malformed responses if handled naively.
  stubFetch((url) =>
    url.includes("runQuery") ? { body: [{ readTime: "now" }] } : { body: {} }
  );

  assert.deepEqual((await client().collection("skills").get()).docs, []);
  assert.deepEqual((await client().collection("posts").get()).docs, []);
});

test("a missing document reports exists: false", async () => {
  stubFetch(() => ({ status: 404 }));

  const snapshot = await client().collection("profile").doc("main").get();

  assert.equal(snapshot.exists, false);
  assert.equal(snapshot.data(), null);
});

test("an existing document decodes its fields", async () => {
  stubFetch(() => ({
    body: {
      name: "a/documents/profile/main",
      fields: { email: { stringValue: "nikhildmasurkar@gmail.com" } },
    },
  }));

  const snapshot = await client().collection("profile").doc("main").get();

  assert.equal(snapshot.exists, true);
  assert.equal(snapshot.data().email, "nikhildmasurkar@gmail.com");
});

test("a permissions error throws rather than reading as empty", async () => {
  stubFetch(() => ({
    status: 403,
    body: { error: { status: "PERMISSION_DENIED" } },
  }));

  // Must not look like "no content" — content.js needs to see the failure so
  // it serves stale cache instead of publishing an empty site.
  await assert.rejects(
    () => client().collection("skills").get(),
    /Firestore 403/
  );
});
