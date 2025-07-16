'use client';

import AddToQueueForm from './components/AddToQueueForm';
import QueueList from './components/QueueList';
import QueueStats from './components/QueueStats';
import OfflineBanner from './components/OfflineBanner';
import OfflineToggle from './components/OfflineToggle';
import { useQueue } from './contexts/QueueContext';

export default function Home() {
  const { isOffline } = useQueue();
  
  return (
    <div className={isOffline ? 'pt-24' : ''}>
      {/* Offline Banner */}
      <OfflineBanner />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Queue Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your queue and keep track of waiting customers</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <QueueStats />
          <QueueList />
        </div>
        
        <div className="lg:col-span-1 order-1 lg:order-2">
          {/* Offline Toggle Control */}
          <OfflineToggle />
          
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Add to Queue</h2>
            <AddToQueueForm />
          </div>
        </div>
      </div>
    </div>
  );
}
