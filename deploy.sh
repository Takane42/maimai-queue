#!/bin/bash

# Exit on error
set -e

echo "🚀 Deploying Queue Management App..."

# Pull latest changes if in a git repository
if [ -d .git ]; then
  echo "📥 Pulling latest changes..."
  git pull
fi

# Build and run with Docker Compose
echo "🏗️ Building and starting with Docker Compose..."
docker-compose up --build -d

echo "✅ Deployment complete! App is running at http://localhost:3000"

# Show logs
echo "📋 Container logs:"
docker-compose logs -f
