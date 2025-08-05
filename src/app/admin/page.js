'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [cronResult, setCronResult] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [schedulerStatus, setSchedulerStatus] = useState(null);
  const [schedulerLoading, setSchedulerLoading] = useState(false);

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

  // Fetch scheduler status on component mount
  useEffect(() => {
    fetchSchedulerStatus();
  }, []);

  const fetchSchedulerStatus = async () => {
    try {
      const response = await fetch('/api/scheduler');
      const data = await response.json();
      setSchedulerStatus(data);
    } catch (error) {
      console.error('Error fetching scheduler status:', error);
    }
  };

  const toggleScheduler = async () => {
    if (schedulerLoading) return;
    
    setSchedulerLoading(true);
    const action = schedulerStatus?.isEnabled ? 'disable' : 'enable';
    
    try {
      const response = await fetch('/api/scheduler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action })
      });
      
      const result = await response.json();
      if (result.success) {
        await fetchSchedulerStatus(); // Refresh status
      }
    } catch (error) {
      console.error('Error toggling scheduler:', error);
    } finally {
      setSchedulerLoading(false);
    }
  };

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
        
        {/* Scheduler Status */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Scheduler Status</h3>
              {schedulerStatus ? (
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    schedulerStatus.isEnabled 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {schedulerStatus.isEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                  {schedulerStatus.lastToggleTime && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Last toggled: {new Date(schedulerStatus.lastToggleTime).toLocaleString()}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Loading scheduler status...</p>
              )}
            </div>
            
            {/* Toggle Switch */}
            {schedulerStatus && (
              <div className="flex items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 mr-3">
                  {schedulerLoading ? 'Updating...' : 'Toggle Scheduler'}
                </span>
                <button
                  onClick={toggleScheduler}
                  disabled={schedulerLoading}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                    schedulerStatus.isEnabled
                      ? 'bg-green-600 dark:bg-green-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                  } ${schedulerLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      schedulerStatus.isEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            )}
          </div>
        </div>
        
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
            <p className={`${
              schedulerStatus?.isEnabled 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {schedulerStatus?.isEnabled ? 'Active' : 'Disabled'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}