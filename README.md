# Queue Management Web Application

A modern web application built with Next.js for managing queues on a site. Ideal for businesses, events, or any scenario requiring an organized waiting system.

## Features

- Add users to a queue with name information
- Real-time display of current queue status
- Process and manage people in the queue
- Edit queue entries
- Drag-and-drop queue reordering
- Dark mode support
- Responsive design for all devices
- **Automated daily queue completion** - All active queue items are automatically completed at 10 PM every day
- Timezone-aware scheduling (configurable via environment variables)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Docker Deployment

### Using Docker Compose (Recommended)

1. Make sure you have Docker and Docker Compose installed
2. Run the following command:

```bash
npm run docker:compose
# Or directly
docker-compose up -d
```

This will build the Docker image and start the container. The app will be accessible at http://localhost:3000.

### Manual Docker Build and Run

```bash
# Build the Docker image
npm run docker:build
# Or directly
docker build -t maimai-queue .

# Run the container
npm run docker:run
# Or directly
docker run -p 3000:3000 maimai-queue
```

### Data Persistence

The SQLite database is stored in a Docker volume named `sqlite_data`. This ensures that your queue data persists between container restarts.

## Cron Jobs and Automation

### Daily Queue Completion

The application automatically completes all active queue items every day at 10:00 PM. This helps ensure that the queue is reset for the next day.

**Features:**
- Runs at 10:00 PM in the configured timezone (default: America/New_York)
- Marks all waiting and processing queue items as "completed"
- Logs the completion action for monitoring
- Can be manually triggered via API for testing

### Configuration

**Timezone Settings:**
You can customize the timezone by setting the `TIMEZONE` environment variable:

```bash
# Docker run example with custom timezone
docker run -p 3000:3000 -e TIMEZONE=Europe/London maimai-queue

# Docker compose - add to environment section:
environment:
  - TIMEZONE=Asia/Tokyo
```

**Manual Testing:**
You can manually trigger the daily completion using the provided test scripts:

```bash
# Unix/Linux/Mac
./test-daily-completion.sh

# Windows
test-daily-completion.bat

# Or directly with curl
curl -X POST http://localhost:3000/api/cron/complete-daily -H "Content-Type: application/json"
```

## Alternative Deployment: Vercel

The easiest way to deploy your Next.js app without Docker is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
