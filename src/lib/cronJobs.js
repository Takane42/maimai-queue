const cron = require('node-cron');

// Function to call the daily completion API
async function completeDailyQueue() {
  try {
    // Use localhost for local development, or the actual server URL in production
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    console.log(`Attempting to call: ${baseUrl}/api/cron/complete-daily`);
    
    const response = await fetch(`${baseUrl}/api/cron/complete-daily`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('Daily queue completion successful:', result);
    } else {
      console.error('Daily queue completion failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error calling daily queue completion API:', error);
  }
}

// Initialize cron jobs
function initializeCronJobs() {
  const timezone = process.env.TIMEZONE || 'Asia/Jakarta'; // Changed default to Asia/Jakarta
  const now = new Date();
  const currentTime = now.toLocaleString('en-US', { timeZone: timezone });
  
  console.log('Initializing cron jobs...');
  console.log(`Current time in ${timezone}: ${currentTime}`);
  console.log(`Server time: ${now.toISOString()}`);
  
  // For testing: Run every minute to verify it's working
  cron.schedule('* * * * *', () => {
    const testTime = new Date().toLocaleString('en-US', { timeZone: timezone });
    console.log(`Test cron running at: ${testTime} (${timezone})`);
  }, {
    timezone: timezone
  });
  
  // Run every day at 10:00 PM (22:00)
  cron.schedule('0 22 * * *', () => {
    const triggerTime = new Date().toLocaleString('en-US', { timeZone: timezone });
    console.log(`Running daily queue completion at 10:00 PM. Trigger time: ${triggerTime} (${timezone})`);
    completeDailyQueue();
  }, {
    timezone: timezone
  });
  
  console.log(`Cron jobs initialized. Daily queue completion scheduled for 10:00 PM in ${timezone} timezone.`);
  console.log('Test cron will run every minute for debugging.');
}

module.exports = { initializeCronJobs };
