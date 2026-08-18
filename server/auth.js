import { createRemoteJWKSet, jwtVerify } from "jose";

/**
 * Verifies a Firebase ID token without a service account.
 *
 * Firebase ID tokens are RS256 JWTs signed by Google, and the signing keys are
 * published openly — so verifying one needs no credential at all. This is what
 * lets the upload route authenticate an admin on a project where service
 * account keys are blocked by policy.
 *
 * Uses `jose` rather than hand-rolling this with node:crypto. Verification is
 * where JWT implementations get subtly wrong — algorithm confusion, `alg: none`,
 * unvalidated `kid`, missing clock checks — and none of those mistakes look
 * like failures until someone exploits them. The library also handles key
 * rotation and caching, which Google does on its own schedule.
 */

const PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID;

/**
 * Google's public keys, in JWKS form. createRemoteJWKSet caches them and
 * refetches only when it sees an unknown `kid`, so this is not a network round
 * trip per request.
 */
const JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

/**
 * @returns the token's claims
 * @throws if the token is missing, malformed, expired, or not issued by this
 *         Firebase project — callers should treat any throw as a 401.
 */
export async function verifyIdToken(token) {
  if (!token) throw new Error("no token supplied");
  if (!PROJECT_ID) throw new Error("VITE_FIREBASE_PROJECT_ID is not set");

  const { payload } = await jwtVerify(token, JWKS, {
    // Pinned explicitly. Without this a token could nominate its own algorithm,
    // which is the classic way JWT verification is bypassed.
    algorithms: ["RS256"],
    issuer: `https://securetoken.google.com/${PROJECT_ID}`,
    audience: PROJECT_ID,
  });

  // A token from another Firebase project would already have failed the issuer
  // and audience checks above. This catches the remaining shape problem: a
  // token with no subject is not a user.
  if (!payload.sub) throw new Error("token has no subject");

  return payload;
}

/**
 * Whether these claims belong to the one account allowed to write.
 *
 * `email_verified` is not decoration. Without it, an identity provider that
 * permits unverified addresses would let someone claim the admin address and
 * pass this check. The same pair of conditions is enforced in
 * firestore.rules — this is the second gate, not the only one.
 */
export function isAdminClaims(claims, adminEmail = process.env.ADMIN_EMAIL) {
  return Boolean(
    adminEmail && claims?.email === adminEmail && claims?.email_verified === true
  );
}
