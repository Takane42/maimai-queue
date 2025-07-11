'use client';

import { useQueue } from '../contexts/QueueContext';

const QueueStats = () => {
  const { getQueueStats, isLoading } = useQueue();
  
  const stats = getQueueStats();
    // No longer needed time format function

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/3"></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          ))}
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Queue Statistics</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
          <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">Players Waiting</p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">{stats.waiting}</p>
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md">
          <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium">Players Playing</p>
          <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-200">{stats.processing}</p>
        </div>
      </div>
    </div>
  );
};

export default QueueStats;
