const cron = require('node-cron');

// Function to call the daily completion API
async function completeDailyQueue() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
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
  console.log('Initializing cron jobs...');
  
  // Run every day at 10:00 PM (22:00)
  cron.schedule('0 22 * * *', () => {
    console.log('Running daily queue completion at 10:00 PM');
    completeDailyQueue();
  }, {
    timezone: process.env.TIMEZONE || 'America/New_York'
  });
  
  console.log('Cron jobs initialized. Daily queue completion scheduled for 10:00 PM.');
}

module.exports = { initializeCronJobs };
