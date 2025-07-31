'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';

// Create queue context
const QueueContext = createContext();

// Queue statuses
export const QueueStatus = {
  WAITING: 'waiting',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  AFK: 'afk',
};

// SWR fetcher function
const fetcher = (...args) => fetch(...args).then(res => res.json());

export const QueueProvider = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch queue data using SWR
  const { data, error: swrError } = useSWR('/api/queue', fetcher, {
    refreshInterval: 3000, // Refresh every 3 seconds
    onSuccess: (data) => {
      setIsLoading(false);
      setIsProcessing(data?.queue?.some(p => p.status === QueueStatus.PROCESSING) || false);
    },
    onError: (err) => {
      setIsLoading(false);
      setError(err);
    }
  });
  
  // Get queue stats using SWR
  const { data: statsData } = useSWR('/api/queue/stats', fetcher, { 
    refreshInterval: 3000 
  });
  // Add a person to the queue
  const addToQueue = async (queueItem) => {
    try {
      const response = await fetch('/api/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(queueItem)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add to queue');
      }
      
      const newItem = await response.json();
      
      // Update SWR cache
      mutate('/api/queue');
      mutate('/api/queue/stats');
      
      return newItem;
    } catch (error) {
      console.error('Error adding to queue:', error);
      throw error;
    }
  };

  // Get the next person in the queue
  const getNextInQueue = () => {
    const queue = data?.queue || [];
    return queue.find(person => person.status === QueueStatus.WAITING);
  };

  // Process the next person in the queue
  const processNext = async () => {
    try {
      const nextPerson = getNextInQueue();
      
      if (!nextPerson) {
        return null;
      }
      
      const response = await fetch(`/api/queue/${nextPerson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: QueueStatus.PROCESSING })
      });
      
      if (!response.ok) {
        throw new Error('Failed to process next in queue');
      }
      
      const updatedPerson = await response.json();
      
      // Update SWR cache
      mutate('/api/queue');
      mutate('/api/queue/stats');
      
      setIsProcessing(true);
      return updatedPerson;
    } catch (error) {
      console.error('Error processing next in queue:', error);
      throw error;
    }
  };

  // Complete processing for a person
  const completeProcessing = async (id) => {
    try {
      const response = await fetch(`/api/queue/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: QueueStatus.COMPLETED })
      });
      
      if (!response.ok) {
        throw new Error('Failed to complete processing');
      }
      
      const completedPerson = await response.json();
      
      // Update SWR cache
      mutate('/api/queue');
      mutate('/api/queue/stats');
      
      setIsProcessing(false);
      return completedPerson;
    } catch (error) {
      console.error('Error completing processing:', error);
      throw error;
    }
  };

  // Cancel a person from the queue
  const cancelFromQueue = async (id) => {
    try {
      const response = await fetch(`/api/queue/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: QueueStatus.CANCELLED })
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel from queue');
      }
      
      const cancelledPerson = await response.json();
      
      // Check if the cancelled person was being processed
      if (cancelledPerson.status === QueueStatus.PROCESSING) {
        setIsProcessing(false);
      }
      
      // Update SWR cache
      mutate('/api/queue');
      mutate('/api/queue/stats');
      
      return cancelledPerson;
    } catch (error) {
      console.error('Error cancelling from queue:', error);
      throw error;
    }
  };

  // Reorder queue items (for drag and drop)
  const reorderQueue = async (items) => {
    try {
      const response = await fetch('/api/queue/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });
      
      if (!response.ok) {
        throw new Error('Failed to reorder queue');
      }
      
      // Update SWR cache
      mutate('/api/queue');
      
      return await response.json();
    } catch (error) {
      console.error('Error reordering queue:', error);
      throw error;
    }
  };

  // Toggle AFK status for a person
  const toggleAFK = async (id) => {
    try {
      // First get the current person data to determine the new status
      const currentQueue = data?.queue || [];
      const person = currentQueue.find(p => p.id === id);
      
      if (!person) {
        throw new Error('Person not found in queue');
      }
      
      const newStatus = person.status === QueueStatus.AFK ? QueueStatus.WAITING : QueueStatus.AFK;
      
      const response = await fetch(`/api/queue/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        throw new Error('Failed to toggle AFK status');
      }
      
      const updatedPerson = await response.json();
      
      // Update SWR cache
      mutate('/api/queue');
      mutate('/api/queue/stats');
      
      return updatedPerson;
    } catch (error) {
      console.error('Error toggling AFK status:', error);
      throw error;
    }
  };

  // Edit a queue item
  const editQueueItem = async (id, updates) => {
    try {
      const response = await fetch(`/api/queue/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update queue item');
      }
      
      const updatedItem = await response.json();
      
      // Update SWR cache
      mutate('/api/queue');
      
      return updatedItem;
    } catch (error) {
      console.error('Error updating queue item:', error);
      throw error;
    }
  };

  // Get queue statistics
  const getQueueStats = () => {
    if (statsData) {
      return statsData;
    }
    
    // Fallback to calculated stats if API data isn't available
    const queue = data?.queue || [];
    
    // Get today's date range
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    // Filter for today's queue entries
    const todaysQueue = queue.filter(person => {
      const joinedDate = new Date(person.joinedAt);
      return joinedDate >= startOfDay && joinedDate < endOfDay;
    });
    
    // Count unique players (both name1 and name2) for each status
    const waitingPlayers = new Set();
    const processingPlayers = new Set();
    
    todaysQueue.forEach(entry => {
      if (entry.status === QueueStatus.WAITING) {
        waitingPlayers.add(entry.name1);
        if (entry.name2) {
          waitingPlayers.add(entry.name2);
        }
      } else if (entry.status === QueueStatus.PROCESSING) {
        processingPlayers.add(entry.name1);
        if (entry.name2) {
          processingPlayers.add(entry.name2);
        }
      }
    });
    
    return {
      waiting: waitingPlayers.size,
      processing: processingPlayers.size,
    };
  };  return (
    <QueueContext.Provider
      value={{
        queue: data?.queue || [],
        currentNumber: data?.currentNumber || 1,
        isProcessing,
        isLoading,
        error,
        addToQueue,
        getNextInQueue,
        processNext,
        completeProcessing,
        cancelFromQueue,
        reorderQueue,
        editQueueItem,
        toggleAFK,
        getQueueStats,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

// Custom hook for using queue context
export const useQueue = () => useContext(QueueContext);

export default QueueContext;
