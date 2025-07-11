'use client';

import { useEffect } from 'react';

// Component to initialize background services (scheduler and cron jobs)
export default function SchedulerInitializer() {
  useEffect(() => {
    // Initialize the scheduler and cron jobs on the client side
    const initServices = async () => {
      try {
        // Initialize scheduler
        const schedulerResponse = await fetch('/api/scheduler/init', {
          method: 'POST',
        });
        
        if (schedulerResponse.ok) {
          console.log('Scheduler initialized successfully');
        }

        // Initialize cron jobs
        const cronResponse = await fetch('/api/cron/init', {
          method: 'POST',
        });
        
        if (cronResponse.ok) {
          console.log('Cron jobs initialized successfully');
        }
      } catch (error) {
        console.error('Failed to initialize services:', error);
      }
    };

    initServices();
  }, []);

  return null; // This component doesn't render anything, just initializes services
}
