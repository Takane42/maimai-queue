'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [cronResult, setCronResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Admin Panel
      </h1>
      
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