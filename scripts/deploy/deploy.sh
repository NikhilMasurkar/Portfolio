#!/usr/bin/env bash
#
# Roll the service onto the image build-push.sh pushed.
#   ./scripts/deploy/deploy.sh
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/../.."

CFG=project.config.json
REGION=$(node -p "require('./$CFG').deploy.awsRegion")
CLUSTER=$(node -p "require('./$CFG').deploy.ecsCluster")
SERVICE=$(node -p "require('./$CFG').deploy.ecsService")
SITE=$(node -p "require('./$CFG').domain")

step() { printf '\n\033[1m==> %s\033[0m\n' "$1"; }

step "Deploying $SERVICE on $CLUSTER"
# minimumHealthyPercent=100 keeps the old tasks serving until the new ones pass
# their health check, so a container that crashes on boot cannot take the site
# down — it simply fails to replace anything.
aws ecs update-service --cluster "$CLUSTER" --service "$SERVICE" \
  --force-new-deployment \
  --deployment-configuration maximumPercent=200,minimumHealthyPercent=100 \
  --region "$REGION" --output text \
  --query 'service.{name:serviceName,desired:desiredCount,running:runningCount}'

step "Waiting for tasks to stabilise"
aws ecs wait services-stable --cluster "$CLUSTER" --services "$SERVICE" --region "$REGION"

step "Verifying the live site"
npm run verify -- "$SITE" || {
  printf '\n\033[31mLive site failed verification.\033[0m Roll back with:\n'
  printf '  aws ecs update-service --cluster %s --service %s \\\n' "$CLUSTER" "$SERVICE"
  printf '    --task-definition <previous-revision> --region %s\n\n' "$REGION"
  exit 1
}
printf '\n\033[32mDeployed and verified: %s\033[0m\n\n' "$SITE"
