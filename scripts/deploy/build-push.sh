#!/usr/bin/env bash
#
# Build, verify, and push the image to ECR.
#   ./scripts/deploy/build-push.sh
# Then: ./scripts/deploy/deploy.sh
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/../.."

CFG=project.config.json
ACCOUNT=$(node -p "require('./$CFG').deploy.awsAccountId")
REGION=$(node -p "require('./$CFG').deploy.awsRegion")
REPO=$(node -p "require('./$CFG').deploy.ecrRepo")
REGISTRY="${ACCOUNT}.dkr.ecr.${REGION}.amazonaws.com"

step() { printf '\n\033[1m==> %s\033[0m\n' "$1"; }
die()  { printf '\n\033[31mFAILED: %s\033[0m\n\n' "$1" >&2; exit 1; }

[ -n "$ACCOUNT" ] || die "Set deploy.awsAccountId in $CFG"

step "Checking the working tree"
[ -z "$(git status --porcelain)" ] || { git status --short; die "Commit or stash first."; }
git pull --ff-only
echo "commit: $(git rev-parse --short HEAD) — $(git log -1 --pretty=%s)"

step "Building and verifying locally"
npm ci
npm run build
npm run lint || die "Lint failed."

PORT=4173 npm run ssr > /tmp/verify.log 2>&1 &
SSR_PID=$!
trap 'kill $SSR_PID 2>/dev/null || true' EXIT
for _ in $(seq 1 30); do curl -fs http://localhost:4173/healthz >/dev/null 2>&1 && break; sleep 1; done
npm run verify -- http://localhost:4173 || { tail -20 /tmp/verify.log; die "Verification failed. Nothing pushed."; }
kill $SSR_PID 2>/dev/null || true; trap - EXIT

step "Building image for linux/amd64"
# --platform: ECS Fargate is x86_64. Building on Apple Silicon without this
#   yields an arm64 image that pushes fine then dies with "exec format error".
# --provenance false: skips the attestation manifest, which turns the image
#   into a multi-manifest list some ECS setups refuse to pull.
docker build --platform linux/amd64 --provenance false -t "$REPO" .

step "Pushing to $REGISTRY/$REPO"
aws ecr get-login-password --region "$REGION" \
  | docker login --username AWS --password-stdin "$REGISTRY"
SHA="$(git rev-parse --short HEAD)"
docker tag "$REPO:latest" "$REGISTRY/$REPO:latest"
docker tag "$REPO:latest" "$REGISTRY/$REPO:$SHA"
docker push "$REGISTRY/$REPO:latest"
docker push "$REGISTRY/$REPO:$SHA"

printf '\n\033[32mPushed %s:latest and :%s\033[0m\nNow run: ./scripts/deploy/deploy.sh\n\n' "$REPO" "$SHA"
