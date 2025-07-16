'use client';

import { useQueue } from '../contexts/QueueContext';

const OfflineBanner = () => {
  const { isOffline } = useQueue();
  
  if (!isOffline) return null;
  
  return (
    <div className="fixed top-16 left-0 right-0 z-[5] bg-red-500 dark:bg-red-600 text-white p-4 shadow-lg border-b border-red-600 dark:border-red-500">
      <div className="flex items-center justify-center">
        <div className="flex items-center">
          <svg 
            className="w-6 h-6 mr-3 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          <div>
            <h3 className="font-bold text-lg">⚠️ Maimai Machine is Offline</h3>
            <p className="text-red-100 dark:text-red-200">
              The machine is currently unavailable. Queue management is temporarily suspended.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineBanner;
