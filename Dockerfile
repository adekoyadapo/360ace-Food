# Multi-stage Dockerfile for Next.js 14 app (production runtime)

FROM node:20-alpine AS base
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache libc6-compat

# 1) Install deps using a clean layer
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# Use npm ci for reproducible installs
RUN apk add --no-cache python3 make g++ && npm ci

# 2) Build the app with dev deps present
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npm run build

# 3) Run the standalone server with only what’s needed
FROM node:20-alpine AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app
RUN addgroup -g 1001 -S nodejs \
  && adduser -S nextjs -u 1001 -G nodejs -h /home/nextjs
RUN apk add --no-cache libc6-compat

# Static assets and minimal server output
# Ensure non-root ownership for runtime reads
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Extra safety for any edge permissions
RUN chmod -R a+rX /app

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
