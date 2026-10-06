# ==========================================
# 1. Base stage
# ==========================================
FROM node:22-alpine AS base
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
# Configure npm network resilience against ECONNRESET on large dependencies
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-timeout 300000 && \
    (npm ci --no-audit || (sleep 2 && npm ci --no-audit) || (sleep 5 && npm ci --no-audit))

# ==========================================
# 3. Builder stage
# ==========================================
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client and bundle seed script
RUN npx prisma generate
RUN npx esbuild prisma/seed.ts --bundle --platform=node --target=node22 --external:@prisma/client --outfile=prisma/seed.js

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

# Install Prisma CLI globally for standalone DB operations (db push, migrate)
RUN npm install -g prisma@6.4.1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy static assets and standalone bundle
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
