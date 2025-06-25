'use client';

import { useEffect } from 'react';

export default function SchedulerInitializer() {
  useEffect(() => {
    // Initialize the scheduler on the client side
    const initScheduler = async () => {
      try {
        // Call an API endpoint that will initialize the scheduler on the server
        const response = await fetch('/api/scheduler/init', {
          method: 'POST',
        });
        
        if (response.ok) {
          console.log('Scheduler initialized successfully');
        }
      } catch (error) {
        console.error('Failed to initialize scheduler:', error);
      }
    };

    initScheduler();
  }, []);

  return null; // This component doesn't render anything
}
