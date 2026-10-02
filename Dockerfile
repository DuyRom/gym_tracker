# ==========================================
# 1. Base stage
# ==========================================
FROM node:20-alpine AS base
WORKDIR /app
# Install openssl and libc6-compat for Prisma engine on Alpine
RUN apk add --no-cache libc6-compat openssl

# ==========================================
# 2. Dependencies stage
# ==========================================
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci

# ==========================================
# 3. Builder stage
# ==========================================
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js app in standalone mode
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# Dummy DB URL for build-time static evaluation if needed
ENV DATABASE_URL="mysql://build:build@localhost:3306/gym_tracker"
RUN npm run build

# ==========================================
# 4. Runner stage
# ==========================================
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy static assets and standalone bundle
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.bin/prisma ./node_modules/.bin/prisma

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
