# ---------------------------------------------------------------------------
#  SSR container
#
#  Build:  docker build --platform linux/amd64 --provenance false -t app .
#  Run:    docker run -p 8080:8080 app
#
#  The server is bundled to one CommonJS file at build time, so production runs
#  plain `node`. Running Babel at runtime instead would force the whole build
#  toolchain into the image and make `npm ci --omit=dev` fatal.
# ---------------------------------------------------------------------------
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app

# Production dependencies only. Safe because Babel is not needed at runtime.
# NOTE: do not set NODE_ENV=production before this line — npm treats that as
# --omit=dev on its own, and the container then dies on boot.
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
ENV NODE_ENV=production

COPY --from=build /app/build ./build
COPY --from=build /app/build-server ./build-server
# If the server reads content from disk at runtime (blog JSON etc.), copy that
# directory here too.

ENV PORT=8080
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/healthz || exit 1
CMD ["node", "build-server/index.cjs"]
