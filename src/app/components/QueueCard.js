'use client';

import { useState } from 'react';
import { useQueue, QueueStatus } from '../contexts/QueueContext';
import EditQueueForm from './EditQueueForm';

const QueueCard = ({ person, position }) => {
  const { cancelFromQueue } = useQueue();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Format time since joined
  const formatTimeSince = (dateString) => {
    const joinedDate = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - joinedDate) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      const mins = diffInMinutes % 60;
      return `${hours}h ${mins}m`;
    }
  };

  // Set background and border colors based on status (with dark mode support)
  const getColors = () => {
    switch (person.status) {
      case QueueStatus.WAITING:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case QueueStatus.PROCESSING:
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-800';
      case QueueStatus.COMPLETED:
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case QueueStatus.CANCELLED:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
      default:
        return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };
  
  // Get the name display with both names if available
  const getNameDisplay = () => {
    if (person.name2) {
      return (
        <>
          <span>{person.name1}</span>
          <span className="text-gray-600 dark:text-gray-400"> & {person.name2}</span>
        </>
      );
    }
    return person.name1;
  };

  const handleCancel = async () => {
    if (confirm('Are you sure you want to remove this person from the queue?')) {
      await cancelFromQueue(person.id);
    }
  };
  return (
    <div 
      className={`rounded-lg border ${getColors()} p-4 mb-3 transition-all`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-indigo-600 dark:bg-indigo-700 text-white flex items-center justify-center font-bold mr-3">
            {position || person.position || 1}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{getNameDisplay()}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatTimeSince(person.joinedAt)} ago
            </p>
          </div>
        </div>
          <div className="flex items-center">
          {person.status === QueueStatus.WAITING && (
            <div className="flex flex-col sm:flex-row gap-2 mr-3">
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-medium py-1 px-2 rounded border border-indigo-300 dark:border-indigo-700 transition-colors w-16"
                aria-label="Edit"
              >
                Edit
              </button>
              <button 
                onClick={handleCancel} 
                className="bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 text-xs font-medium py-1 px-2 rounded border border-red-300 dark:border-red-700 transition-colors w-16"
                aria-label="Cancel"
              >
                Cancel
              </button>
            </div>
          )}
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label={isExpanded ? "Collapse details" : "Expand details"}
          >
            {isExpanded ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          {person.notes && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Notes:</p>
              <p className="text-sm mt-1 bg-gray-50 dark:bg-gray-700 p-2 rounded text-gray-800 dark:text-gray-200">{person.notes}</p>
            </div>
          )}
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            <p>Joined: {new Date(person.joinedAt).toLocaleTimeString()}</p>
            {person.processingStartedAt && (
              <p>Processing started: {new Date(person.processingStartedAt).toLocaleTimeString()}</p>
            )}
            {person.completedAt && (
              <p>Completed: {new Date(person.completedAt).toLocaleTimeString()}</p>
            )}
            {person.cancelledAt && (
              <p>Cancelled: {new Date(person.cancelledAt).toLocaleTimeString()}</p>
            )}
          </div>
        </div>      )}
      
      {isEditing && (
        <EditQueueForm 
          person={person} 
          onClose={() => setIsEditing(false)} 
          onSuccess={() => {
            // Do any additional actions after successful edit
          }}
        />
      )}
    </div>
  );
};

export default QueueCard;
