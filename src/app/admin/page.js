'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [cronResult, setCronResult] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timezone = 'Asia/Jakarta'; // Match your app's timezone
      const timeString = now.toLocaleString('en-US', {
        timeZone: timezone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      setCurrentTime(timeString);
    };

    updateTime(); // Initial call
    const interval = setInterval(updateTime, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  const triggerDailyCompletion = async () => {
    setIsLoading(true);
    setCronResult(null);
    
    try {
      const response = await fetch('/api/cron/complete-daily', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      setCronResult(result);
    } catch (error) {
      setCronResult({ error: 'Failed to trigger daily completion' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDebugInfo = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cron/debug');
      const data = await response.json();
      setDebugInfo(data);
    } catch (error) {
      console.error('Error fetching debug info:', error);
      setDebugInfo({ error: 'Failed to fetch debug info' });
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Admin Panel
      </h1>
      
      {/* Real-time Clock */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Current Time (Asia/Jakarta)
        </h2>
        <div className="text-2xl font-mono text-indigo-600 dark:text-indigo-400">
          {currentTime || 'Loading...'}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Cron Job Management
        </h2>
        
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            The daily queue completion job runs automatically every day at 10:00 PM. 
            You can manually trigger it here for testing purposes.
          </p>
          
          <button
            onClick={triggerDailyCompletion}
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-2 rounded-md transition-colors"
          >
            {isLoading ? 'Running...' : 'Trigger Daily Completion'}
          </button>
        </div>
        
        {cronResult && (
          <div className={`p-4 rounded-md ${
            cronResult.error 
              ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
              : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
          }`}>
            <h3 className={`font-medium mb-2 ${
              cronResult.error 
                ? 'text-red-800 dark:text-red-200' 
                : 'text-green-800 dark:text-green-200'
            }`}>
              {cronResult.error ? 'Error' : 'Success'}
            </h3>
            <pre className={`text-sm ${
              cronResult.error 
                ? 'text-red-700 dark:text-red-300' 
                : 'text-green-700 dark:text-green-300'
            }`}>
              {JSON.stringify(cronResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
      
      {/* Debug Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Debug Information
        </h2>
        
        <button
          onClick={fetchDebugInfo}
          disabled={isLoading}
          className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors mb-4"
        >
          {isLoading ? 'Loading...' : 'Fetch Debug Info'}
        </button>
        
        {debugInfo && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
            <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap overflow-x-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Cron Job Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Schedule</h3>
            <p className="text-gray-600 dark:text-gray-300">Every day at 10:00 PM</p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Timezone</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {process.env.NEXT_PUBLIC_TIMEZONE || 'America/New_York'}
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Action</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Complete all active queue items
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Status</h3>
            <p className="text-green-600 dark:text-green-400">Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}