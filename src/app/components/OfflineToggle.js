'use client';

import { useQueue } from '../contexts/QueueContext';

const OfflineToggle = () => {
  const { isOffline, toggleOfflineMode } = useQueue();
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Machine Status</h3>
        </div>
        <div className="flex items-center">
          <span className={`mr-3 text-sm font-medium ${isOffline ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
            {isOffline ? 'Offline' : 'Online'}
          </span>
          <button
            onClick={toggleOfflineMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              isOffline 
                ? 'bg-red-500 dark:bg-red-600' 
                : 'bg-green-500 dark:bg-green-600'
            }`}
            role="switch"
            aria-checked={!isOffline}
            aria-label="Toggle machine online/offline status"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isOffline ? 'translate-x-1' : 'translate-x-6'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfflineToggle;
