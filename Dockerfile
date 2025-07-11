FROM node:20-alpine AS base
ENV TIMEZONE=Asia/Jakarta

# Install dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++ build-base

# Set working directory
WORKDIR /app

# Install dependencies
FROM base AS deps
ENV TIMEZONE=Asia/Jakarta
COPY package.json ./
RUN npm install

# Build the app
FROM base AS builder
ENV TIMEZONE=Asia/Jakarta
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner

ENV NODE_ENV=production

# Set timezone for cron jobs (can be overridden with docker run -e TIMEZONE=your_timezone)
# Default timezone is America/New_York, cron job runs at 10 PM in this timezone
ENV TIMEZONE=Asia/Jakarta

# Install tzdata for timezone support
RUN apk add --no-cache tzdata

# Set the timezone
RUN ln -sf /usr/share/zoneinfo/$TIMEZONE /etc/localtime && echo $TIMEZONE > /etc/timezone


# Create app directory
WORKDIR /app

# Don't run as root - create user and group first
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Create directories and set ownership BEFORE switching users
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

# Copy necessary files
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/data ./data

# NOW switch to the nextjs user
USER nextjs

# Expose the port
EXPOSE 3000

# Set the command to run
CMD ["node", "server.js"]