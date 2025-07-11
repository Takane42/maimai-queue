import { NextResponse } from 'next/server';

let cronJobsInitialized = false;

export async function POST() {
  try {
    if (!cronJobsInitialized) {
      // Import and initialize cron jobs
      const { initializeCronJobs } = require('@/lib/cronJobs');
      initializeCronJobs();
      cronJobsInitialized = true;
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cron jobs initialized successfully' 
    });
  } catch (error) {
    console.error('Error initializing cron jobs:', error);
    return NextResponse.json(
      { error: 'Failed to initialize cron jobs' },
      { status: 500 }
    );
  }
}
