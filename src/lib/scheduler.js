import cron from 'node-cron';

let isScheduled = false;

export function scheduleReset() {
  if (isScheduled) return;
  
  // Schedule reset every day at 10 PM (22:00)
  cron.schedule('0 22 * * *', async () => {
    try {
      console.log('Running scheduled database reset at 10 PM...');
      
      // Call the reset API internally
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/queue/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Scheduled reset completed:', result);
      } else {
        console.error('Scheduled reset failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during scheduled reset:', error);
    }
  }, {
    timezone: 'Asia/Singapore' // Change this to your desired timezone
  });
  
  isScheduled = true;
  console.log('Daily reset scheduler initialized - will run at 10 PM every day');
}

// Alternative approach using interval checking
export function scheduleResetWithInterval() {
  if (isScheduled) return;
  
  let lastResetDate = null;
  
  // Check every minute if it's time to reset
  const interval = setInterval(async () => {
    const now = new Date();
    const currentDate = now.toDateString();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Check if it's 10 PM (22:00) and we haven't reset today
    if (currentHour === 22 && currentMinute === 0 && lastResetDate !== currentDate) {
      try {
        console.log('Running scheduled database reset at 10 PM...');
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/queue/reset`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('Scheduled reset completed:', result);
          lastResetDate = currentDate;
        } else {
          console.error('Scheduled reset failed:', response.statusText);
        }
      } catch (error) {
        console.error('Error during scheduled reset:', error);
      }
    }
  }, 60000); // Check every minute
  
  isScheduled = true;
  console.log('Daily reset scheduler initialized - will run at 10 PM every day');
  
  return interval;
}
