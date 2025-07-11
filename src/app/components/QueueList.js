'use client';

import { useState } from 'react';
import { useQueue, QueueStatus } from '../contexts/QueueContext';
import QueueCard from './QueueCard';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const QueueList = () => {
  const { queue, isProcessing, isLoading, processNext, completeProcessing, reorderQueue } = useQueue();
  const [isDragging, setIsDragging] = useState(false);
  
  // Get waiting people
  const waitingPeople = queue.filter(person => person.status === QueueStatus.WAITING);
  
  // Get unique waiting players count (including both name1 and name2)
  const uniqueWaitingPlayers = new Set();
  waitingPeople.forEach(person => {
    uniqueWaitingPlayers.add(person.name1);
    if (person.name2) {
      uniqueWaitingPlayers.add(person.name2);
    }
  });
  const uniqueWaitingCount = uniqueWaitingPlayers.size;
  
  // Get currently processing person
  const processingPerson = queue.find(person => person.status === QueueStatus.PROCESSING);
  
  const handleProcessNext = async () => {
    await processNext();
  };
  
  const handleComplete = async () => {
    if (processingPerson) {
      await completeProcessing(processingPerson.id);
    }
  };
  
  const handleDragEnd = async (result) => {
    setIsDragging(false);
    
    // Dropped outside the list
    if (!result.destination) {
      return;
    }
    
    // No change in position
    if (result.destination.index === result.source.index) {
      return;
    }
    
    // Create a new array of waiting people with the updated order
    const items = Array.from(waitingPeople);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update the backend
    await reorderQueue(items);
  };
  
  const handleDragStart = () => {
    setIsDragging(true);
  };
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Now Serving</h2>
        
        {isLoading ? (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        ) : processingPerson ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold text-lg mr-3">
                ッ
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {processingPerson.name1}
                    {processingPerson.name2 && <span className="text-gray-600 dark:text-gray-400"> & {processingPerson.name2}</span>}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Started: {new Date(processingPerson.processingStartedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleComplete}
                className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Complete
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-3">No one is currently being served</p>
            
            {waitingPeople.length > 0 ? (
              <button
                onClick={handleProcessNext}
                className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Process Next
              </button>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">Queue is empty</p>
            )}
          </div>
        )}
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Waiting List</h2>
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-sm font-medium px-2.5 py-0.5 rounded">
            {uniqueWaitingCount} {uniqueWaitingCount === 1 ? 'player' : 'players'} waiting
          </span>
        </div>
        
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((_, i) => (
              <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 animate-pulse">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full mr-3"></div>
                  <div className="w-3/4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : waitingPeople.length > 0 ? (
          <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
            <Droppable droppableId="queue">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`transition-all duration-200 ${isDragging ? 'bg-blue-50 dark:bg-blue-900/10 rounded-lg p-2' : ''}`}
                >
                  {waitingPeople.map((person, index) => (
                    <Draggable key={person.id} draggableId={String(person.id)} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`${snapshot.isDragging ? 'shadow-lg' : ''}`}
                        >
                          <QueueCard person={person} position={index + 1} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
            <p className="text-gray-500 dark:text-gray-400">Queue is empty</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueueList;
