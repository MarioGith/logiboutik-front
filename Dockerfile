FROM node:22-alpine AS base

# Installs dependencies
FROM base AS deps
RUN npm install -g pnpm@12.14.0
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Builds the Next.js app. SERVER_BASE_URL (the API address seen by the
# browser) is baked in at build time; without it http://localhost:8082 is used.
FROM deps AS builder
COPY . .
ARG SERVER_BASE_URL
ENV SERVER_BASE_URL=$SERVER_BASE_URL
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# Final image: the standalone Next.js server only
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/next-i18next.config.js ./next-i18next.config.js

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
