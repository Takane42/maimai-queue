FROM node:20-alpine AS base

# Install dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++ build-base

# Set working directory
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json ./
RUN npm install

# Build the app
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner

ENV NODE_ENV=production

# Create app directory
WORKDIR /app

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copy necessary files
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Create a directory for the SQLite database and make it writable for the nextjs user
RUN mkdir -p /app/data
COPY --from=builder --chown=nextjs:nodejs /app/data ./data

# Expose the port
EXPOSE 3000

# Set the command to run
CMD ["node", "server.js"]
