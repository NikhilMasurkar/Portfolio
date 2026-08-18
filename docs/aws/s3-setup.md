# S3 setup for uploads

Everything the admin panel uploads — resume PDF, project screenshots, avatar —
goes to one bucket. Apply the four settings below to it.

Replace `YOUR-BUCKET` throughout, and `https://nikhilmasurkar.netlify.app` if
the domain changes.

Uploaded objects live under `public/`. Nothing else in the bucket is readable
from the internet, so the bucket stays usable for unrelated private files.

---

## 1. Object Ownership — leave ACLs disabled

Console → bucket → Permissions → Object Ownership → **Bucket owner enforced**.

This is the default on buckets created in recent years. Keep it. Public read is
granted by the bucket policy in step 3, *not* by per-object ACLs — a presigned
upload asking for `acl: public-read` against an ACL-disabled bucket is
rejected outright.

## 2. Block Public Access — allow policy-based public access

Console → bucket → Permissions → Block public access (bucket settings) → Edit.

| Setting | Value |
|---|---|
| Block public access granted through **new** ACLs | ✅ on |
| Block public access granted through **any** ACLs | ✅ on |
| Block public access granted through **new** public bucket policies | ❌ **off** |
| Block public access granted through **any** public bucket policies | ❌ **off** |

Leaving the two ACL rows on is correct — ACLs are disabled anyway. The two
policy rows must be off, or the policy in step 3 is silently ignored and every
image 403s.

## 3. Bucket policy — public read on `public/` only

Console → bucket → Permissions → Bucket policy.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadServedAssetsOnly",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET/public/*"
    }
  ]
}
```

Scoped to the `public/` prefix on purpose. `Resource: ".../*"` would expose the
whole bucket, including anything stored there later for unrelated reasons.

## 4. CORS — allow the browser to POST

Console → bucket → Permissions → Cross-origin resource sharing (CORS).

```json
[
  {
    "AllowedOrigins": [
      "https://nikhilmasurkar.netlify.app",
      "http://localhost:8080",
      "http://localhost:3000"
    ],
    "AllowedMethods": ["POST", "GET"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag", "Location"],
    "MaxAgeSeconds": 3000
  }
]
```

`POST`, because uploads use presigned POST rather than PUT — see §7b of the
spec for why. Without this block the upload fails in the browser while the
identical presigned request succeeds from `curl`, which is a confusing hour if
you do not know to look here.

The localhost origins are for local admin work. Harmless: an attacker's page
cannot use them, since every upload still needs a signature minted by the
server against a verified Firebase token.

---

## 5. IAM user — least privilege

Create a dedicated IAM user (not your root account, no console access, access
key only) with exactly this inline policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "UploadServedAssets",
      "Effect": "Allow",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET/public/*"
    },
    {
      "Sid": "ManageServedAssets",
      "Effect": "Allow",
      "Action": ["s3:DeleteObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::YOUR-BUCKET/public/*"
    }
  ]
}
```

`PutObject` is what the presigned POST is signed with. `DeleteObject` lets the
admin panel remove a replaced screenshot. No `ListBucket`, no bucket-level
actions, nothing outside `public/` — so a leaked key cannot read the rest of
the bucket, enumerate it, or touch bucket configuration.

### Click path

**IAM → Users → Create user**

1. User name: `portfolio-uploads`
2. Leave **"Provide user access to the AWS Management Console" unchecked** —
   this identity signs uploads and should never be able to log in.
3. Next → **Attach policies directly**, attach nothing → **Create user**

**The policy.** Open the new user → **Permissions** tab →
**Add permissions ▾** → **Create inline policy** → switch to the **JSON**
editor → paste the policy above with the real bucket name → Next → name it
`portfolio-uploads-s3` → **Create policy**.

**The key.** Same user → **Security credentials** tab → **Access keys** →
**Create access key** → use case **Application running outside AWS** → tick
the confirmation → Next → description `portfolio netlify` →
**Create access key**.

| Shown as | Environment variable |
|---|---|
| Access key (`AKIA…`) | `AWS_ACCESS_KEY_ID` |
| Secret access key | `AWS_SECRET_ACCESS_KEY` |

**Download the .csv before leaving that page.** The secret is shown once and
cannot be retrieved afterwards — recovery means deleting the key and issuing
a new one.

### Rotation

Access keys are long-lived credentials with no expiry, which is why the policy
above is scoped as tightly as it is. To rotate: create a second key, update
the environment, confirm an upload works, then delete the first. Both keys are
valid at once, so there is no downtime and no need to rush the cutover.

## 6. Values to put in the environment

From the bucket and the IAM user, fill these in `.env` locally and in Netlify
→ Site settings → Environment variables:

```
AWS_REGION=              # e.g. ap-south-1
AWS_S3_BUCKET=           # YOUR-BUCKET
AWS_ACCESS_KEY_ID=       # IAM user's key
AWS_SECRET_ACCESS_KEY=   # IAM user's secret
S3_PUBLIC_BASE_URL=      # https://YOUR-BUCKET.s3.<region>.amazonaws.com
```

`S3_PUBLIC_BASE_URL` is not generated by AWS — assemble it from the bucket
name and the region shown in the S3 bucket list. A bucket `nikhil-portfolio`
in Mumbai gives `https://nikhil-portfolio.s3.ap-south-1.amazonaws.com`.
No trailing slash; the upload route joins the key on directly.

None of these are `VITE_`-prefixed, and they must never become so — that
prefix inlines a value into the client bundle. The secret key belongs only in
the server environment.

`S3_PUBLIC_BASE_URL` is stored per-object in Firestore as a full URL, so
putting CloudFront in front later means changing this one value and
backfilling existing rows.
